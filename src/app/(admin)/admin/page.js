import { Suspense } from "react";
import DashboardFetcher from "@/components/admin/fetchers/DashboardFetcher";
import DashboardSkeleton from "@/components/admin/skeletons/DashboardSkeleton";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFetcher />
    </Suspense>
  );
}
