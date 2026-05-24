"use server";
import { LISTINGS_BATCH } from "@/utils/constants";
import { getCurrentUser } from "./user";

// Use mock data when no MongoDB is available
import { mockListings } from "@/data/mockListings";

const useMockDb = !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("mock:mock");

function filterMockListings(query: Record<string, any>) {
  let filtered = [...mockListings];

  if (query.category) {
    filtered = filtered.filter((l) => l.category === query.category);
  }
  if (query.userId) {
    filtered = filtered.filter((l) => l.userId === query.userId);
  }
  if (query.roomCount) {
    filtered = filtered.filter((l) => l.roomCount >= +query.roomCount);
  }
  if (query.guestCount) {
    filtered = filtered.filter((l) => l.guestCount >= +query.guestCount);
  }
  if (query.bathroomCount) {
    filtered = filtered.filter((l) => l.bathroomCount >= +query.bathroomCount);
  }
  if (query.country) {
    filtered = filtered.filter((l) => l.country === query.country);
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return filtered;
}

export const getListings = async (query?: {
  [key: string]: string | string[] | undefined | null;
}) => {
  try {
    if (useMockDb) {
      const allListings = filterMockListings(query || {});
      const startIndex = query?.cursor
        ? allListings.findIndex((l) => l.id === query.cursor) + 1
        : 0;
      const listings = allListings.slice(startIndex, startIndex + LISTINGS_BATCH);
      const nextCursor =
        startIndex + LISTINGS_BATCH < allListings.length
          ? listings[listings.length - 1]?.id
          : null;

      return {
        listings,
        nextCursor,
      };
    }

    const { db } = await import("@/lib/db");
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      country,
      startDate,
      endDate,
      category,
      cursor,
    } = query || {};

    let where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (category) {
      where.category = category;
    }

    if (roomCount) {
      where.roomCount = {
        gte: +roomCount,
      };
    }

    if (guestCount) {
      where.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      where.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (country) {
      where.country = country;
    }

    if (startDate && endDate) {
      where.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const filterQuery: any = {
      where,
      take: LISTINGS_BATCH,
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    const listings = await db.listing.findMany(filterQuery);

    const nextCursor =
      listings.length === LISTINGS_BATCH
        ? listings[LISTINGS_BATCH - 1].id
        : null;

    return {
      listings,
      nextCursor,
    };
  } catch (error) {
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const getListingById = async (id: string) => {
  if (useMockDb) {
    const listing = mockListings.find((l) => l.id === id);
    return listing || null;
  }

  const { db } = await import("@/lib/db");
  const listing = await db.listing.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      reservations: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  return listing;
};

export const createListing = async (data: { [x: string]: any }) => {
  const {
    category,
    location: { region, label: country, latlng },
    guestCount,
    bathroomCount,
    roomCount,
    image: imageSrc,
    price,
    title,
    description,
  } = data;

  Object.keys(data).forEach((value: any) => {
    if (!data[value]) {
      throw new Error("Invalid data");
    }
  });

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  if (useMockDb) {
    const newListing = {
      id: `mock-listing-${Date.now()}`,
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      country,
      region,
      latlng,
      price: parseInt(price, 10),
      userId: user.id,
      createdAt: new Date(),
      user: { name: user.name, image: user.image },
      reservations: [],
    };
    (mockListings as any[]).push(newListing);
    return newListing;
  }

  const { db } = await import("@/lib/db");
  const listing = await db.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      country,
      region,
      latlng,
      price: parseInt(price, 10),
      userId: user.id,
    },
  });

  return listing;
};
