import React, { Suspense } from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";
import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";

import { getCurrentUser } from "@/services/user";
import { getReservations } from "@/services/reservation";
import { getFavorites } from "@/services/favorite";

const ReservationPage = async () => {
  const user = await getCurrentUser();
  const favorites = await getFavorites();

  if (!user) return <EmptyState title="未ログイン" subtitle="ログインしてください" />;

  const { listings, nextCursor } = await getReservations({
    userId: user.id,
  });

  if (listings.length === 0)
    return (
      <EmptyState
        title="予約がありません"
        subtitle="物件に予約はありません。"
      />
    );

  return (
    <section className="main-container">
      <Heading title="予約管理" subtitle="物件の予約一覧" backBtn/>
      <div className=" mt-8 md:mt-10 grid  grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
        {listings.map((listing: any) => {
          const { reservation, ...data } = listing;
          const hasFavorited = favorites.includes(listing.id);
          return (
            <ListingCard
              key={listing.id}
              data={data}
              reservation={reservation}
              hasFavorited={hasFavorited}
            />
          );
        })}
        {nextCursor ? (
          <Suspense fallback={<></>}>
            <LoadMore
              nextCursor={nextCursor}
              fnArgs={{ authorId: user.id }}
              queryFn={getReservations}
              queryKey={["reservations", user.id]}
              favorites={favorites}
            />
          </Suspense>
        ) : null}
      </div>
    </section>
  );
};

export default ReservationPage;
