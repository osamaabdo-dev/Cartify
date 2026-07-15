import { Suspense } from "react";
import ProfileDashboardFetcher from "@/components/profile/fetchers/ProfileDashboardFetcher";
import ProfileDashboardSkeleton from "@/components/profile/skeletons/ProfileDashboardSkeleton";

export default function ProfileDashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={<ProfileDashboardSkeleton />}>
        <ProfileDashboardFetcher />
      </Suspense>
    </div>
  );
}
