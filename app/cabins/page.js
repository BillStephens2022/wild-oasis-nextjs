import CabinsList from "@/app/_components/CabinsList";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import Filter from "../_components/Filter";

// revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

export default async function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      {/* the key prop in the Suspense component below is important to force re-render if the 
      filter changes. Without the key prop, users will not see the loading spinner if they 
      change the filter and it takes a few seconds to update - it would appear as if the filter 
      isn't working, when in fact it is but it may take a few seconds to refresh the data */}
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinsList filter={filter} />
      </Suspense>
    </div>
  );
}
