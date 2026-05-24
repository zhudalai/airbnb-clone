"use server";
import { revalidatePath } from "next/cache";
import { Listing, Reservation } from "@prisma/client";

import { LISTINGS_BATCH } from "@/utils/constants";
import { getCurrentUser } from "./user";
import { stripe } from "@/lib/stripe";
import { mockListings } from "@/data/mockListings";

const useMockDb = !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("mock:mock");

// In-memory reservations store for mock mode
const mockReservations: Array<{ id: string; userId: string; listingId: string; startDate: Date; endDate: Date; totalPrice: number; createdAt: Date }> = [];

export const getReservations = async (args: Record<string, string>): Promise<{ listings: any[]; nextCursor: string | null }> => {
  try {
    const { listingId, userId, authorId, cursor } = args;

    if (useMockDb) {
      let filtered = [...mockReservations];

      if (userId) {
        filtered = filtered.filter((r) => r.userId === userId);
      }
      if (listingId) {
        filtered = filtered.filter((r) => r.listingId === listingId);
      }
      if (authorId) {
        filtered = filtered.filter((r) => {
          const listing = mockListings.find((l) => l.id === r.listingId);
          return listing?.userId === authorId;
        });
      }

      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const startIndex = cursor
        ? filtered.findIndex((r) => r.id === cursor) + 1
        : 0;
      const reservations = filtered.slice(startIndex, startIndex + LISTINGS_BATCH);

      const nextCursor =
        startIndex + LISTINGS_BATCH < filtered.length
          ? reservations[reservations.length - 1]?.id
          : null;

      const listings: any[] = [];
      for (const reservation of reservations) {
        const listing = mockListings.find((l) => l.id === reservation.listingId);
        if (listing) {
          listings.push({
            ...listing,
            reservation: {
              id: reservation.id,
              startDate: reservation.startDate,
              endDate: reservation.endDate,
              totalPrice: reservation.totalPrice,
            },
          });
        }
      }

      return {
        listings,
        nextCursor,
      };
    }

    const { db } = await import("@/lib/db");
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (listingId) {
      where.listingId = listingId;
    }

    if (authorId) {
      where.listing = { userId: authorId };
    }

    const filterQuery: any = {
      where,
      take: LISTINGS_BATCH,
      include: {
        listing: true,
      },
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    const reservations = (await db.reservation.findMany({
      ...filterQuery,
    })) as (Reservation & { listing: Listing })[];

    const nextCursor =
      reservations.length === LISTINGS_BATCH
        ? reservations[LISTINGS_BATCH - 1].id
        : null;

    const listings = reservations.map((reservation) => {
      const { id, startDate, endDate, totalPrice, listing } = reservation;

      return {
        ...listing,
        reservation: { id, startDate, endDate, totalPrice },
      };
    });

    return {
      listings,
      nextCursor,
    };
  } catch (error: any) {
    console.log(error?.message);
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const createReservation = async ({
  listingId,
  startDate,
  endDate,
  totalPrice,
  userId
}: {
  listingId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number;
  userId: string
}) => {
  try {
    if (!listingId || !startDate || !endDate || !totalPrice)
      throw new Error("Invalid data");

    if (useMockDb) {
      mockReservations.push({
        id: `mock-reservation-${Date.now()}`,
        userId,
        listingId,
        startDate,
        endDate,
        totalPrice,
        createdAt: new Date(),
      });
    } else {
      const { db } = await import("@/lib/db");
      await db.listing.update({
        where: {
          id: listingId,
        },
        data: {
          reservations: {
            create: {
              userId,
              startDate,
              endDate,
              totalPrice,
            },
          },
        },
      });
    }

    revalidatePath(`/listings/${listingId}`);
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!reservationId || typeof reservationId !== "string") {
      throw new Error("Invalid ID");
    }

    let listingId = "";

    if (useMockDb) {
      const idx = mockReservations.findIndex((r) => r.id === reservationId);
      if (idx === -1) throw new Error("Reservation not found!");
      listingId = mockReservations[idx].listingId;
      mockReservations.splice(idx, 1);
    } else {
      const { db } = await import("@/lib/db");
      const reservation = await db.reservation.findUnique({
        where: {
          id: reservationId,
        }
      });

      if (!reservation) {
        throw new Error("Reservation not found!");
      }

      listingId = reservation.listingId;

      await db.reservation.deleteMany({
        where: {
          id: reservationId,
          OR: [
            { userId: currentUser.id },
            { listing: { userId: currentUser.id } },
          ],
        },
      });
    }

    revalidatePath("/reservations");
    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/trips");

    return { id: reservationId, listingId };
  } catch (error: any) {
    throw new Error(error.message)
  }
};


export const createPaymentSession = async ({
  listingId,
  startDate,
  endDate,
  totalPrice,
}: {
  listingId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number;
}) => {
  if (!listingId || !startDate || !endDate || !totalPrice)
    throw new Error("Invalid data");

  if (useMockDb) {
    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) throw new Error("Listing not found!");
    const user = await getCurrentUser();
    if (!user) throw new Error("Please log in to reserve!");
    // In mock mode, simulate reservation and redirect to trips
    mockReservations.push({
      id: `mock-reservation-${Date.now()}`,
      userId: user.id,
      listingId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      createdAt: new Date(),
    });
    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/trips");
    return { url: "/trips" };
  }

  const { db } = await import("@/lib/db");
  const listing = await db.listing.findUnique({
    where: {id: listingId}
  })

  if(!listing) throw new Error("Listing not found!");

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please log in to reserve!");
  }

  const product = await stripe.products.create({
    name: "Listing",
    images: [listing.imageSrc],
    default_price_data: {
      currency: "USD",
      unit_amount: totalPrice * 100
    }
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trips`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/listings/${listing.id}`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ["DE", "US", "NP", "CH", "BH", "AU"],
    },
    metadata: {
      listingId,
      startDate: String(startDate),
      endDate: String(endDate),
      totalPrice,
      userId: user.id
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return {url: stripeSession.url}
}