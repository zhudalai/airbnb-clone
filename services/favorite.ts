"use server";

import { getCurrentUser } from "./user";
import { revalidatePath } from "next/cache";
import { mockListings } from "@/data/mockListings";

const useMockDb = !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("mock:mock");

// In-memory favorites store for mock mode
let mockFavorites: string[] = [];

export const getFavorites = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return [];

    if (useMockDb) {
      return mockFavorites;
    }

    const { db } = await import("@/lib/db");
    const data = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        favoriteIds: true,
      },
    });

    return data?.favoriteIds ?? [];
  } catch (error) {
    return [];
  }
};

export const updateFavorite = async ({
  listingId,
  favorite,
}: {
  listingId: string;
  favorite: boolean;
}) => {
  try {
    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    const favorites = await getFavorites();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Please sign in to favorite the listing!");
    }

    let newFavorites;
    let hasFavorited;

    if (!favorite) {
      newFavorites = favorites.filter((id) => id !== listingId);
      hasFavorited = false;
    } else {
      if (favorites.includes(listingId)) {
        newFavorites = [...favorites];
      } else {
        newFavorites = [listingId, ...favorites];
      }
      hasFavorited = true;
    }

    if (useMockDb) {
      mockFavorites = newFavorites;
    } else {
      const { db } = await import("@/lib/db");
      await db.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          favoriteIds: newFavorites,
        },
      });
    }

    revalidatePath("/");
    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/favorites");

    return {
      hasFavorited,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getFavoriteListings = async () => {
  try {
    const favoriteIds = await getFavorites();

    if (useMockDb) {
      return mockListings.filter((l) => favoriteIds.includes(l.id));
    }

    const { db } = await import("@/lib/db");
    const favorites = await db.listing.findMany({
      where: {
        id: {
          in: [...(favoriteIds || [])],
        },
      },
    });

    return favorites;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
