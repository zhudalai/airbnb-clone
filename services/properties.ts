"use server";
import { LISTINGS_BATCH } from "@/utils/constants";
import { getCurrentUser } from "./user";
import { revalidatePath } from "next/cache";
import { mockListings } from "@/data/mockListings";

const useMockDb = !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("mock:mock");

export const getProperties = async (args?: Record<string, string>) => {
  try {
    const { userId, cursor } = args || {};

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (useMockDb) {
      const filtered = mockListings.filter((l) => l.userId === userId);
      const startIndex = cursor
        ? filtered.findIndex((l) => l.id === cursor) + 1
        : 0;
      const properties = filtered.slice(startIndex, startIndex + LISTINGS_BATCH);
      const nextCursor =
        startIndex + LISTINGS_BATCH < filtered.length
          ? properties[properties.length - 1]?.id
          : null;

      return {
        listings: properties,
        nextCursor,
      };
    }

    const { db } = await import("@/lib/db");
    const filterQuery: any = {
      where: {
        userId,
      },
      take: LISTINGS_BATCH,
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    const properties = await db.listing.findMany({
      ...filterQuery,
    });

    const nextCursor =
      properties.length === LISTINGS_BATCH
        ? properties[LISTINGS_BATCH - 1].id
        : null;

    return {
      listings: properties,
      nextCursor,
    };
  } catch (error: any) {
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const deleteProperty = async (listingId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    if (useMockDb) {
      const idx = mockListings.findIndex((l) => l.id === listingId && l.userId === currentUser.id);
      if (idx !== -1) mockListings.splice(idx, 1);
    } else {
      const { db } = await import("@/lib/db");
      await db.listing.deleteMany({
        where: {
          id: listingId,
          userId: currentUser.id,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/reservation");
    revalidatePath("/trips");
    revalidatePath("/favorites");
    revalidatePath("/properties");
    revalidatePath(`/listings/${listingId}`);

    return "success";
  } catch (error) {
    throw new Error("Failed to delete the property!");
  }
};
