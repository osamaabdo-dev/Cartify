import { Suspense } from "react";
import ProfileOrdersFetcher from "@/components/profile/fetchers/ProfileOrdersFetcher";
import ProfileOrdersSkeleton from "@/components/profile/skeletons/ProfileOrdersSkeleton";

export default function ProfileOrdersPage() {
  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={<ProfileOrdersSkeleton />}>
        <ProfileOrdersFetcher />
      </Suspense>
    </div>
  );
}
