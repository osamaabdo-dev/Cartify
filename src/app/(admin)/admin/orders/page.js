import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";
import OrderFetcher from "@/components/admin/fetchers/OrderFetcher";
import OrderSkeleton from "@/components/admin/skeletons/OrderSkeleton";

export default function AdminOrdersPage() {
  return (
    <div dir="rtl">
      <main className="flex-grow p-4 sm:p-6 lg:p-10 xl:p-16 max-w-7xl mx-auto">
        <div className="h-[3px] w-[60px] bg-gradient-to-l from-[#775a19] to-[#775a19]/20 rounded-full mb-6" />

        <nav className="flex items-center gap-2 text-sm text-[#45464d] mb-3">
          <Link href="/admin" className="hover:text-[#775a19] transition-colors font-medium">لوحة التحكم</Link>
          <ChevronLeft size={14} />
          <span className="text-[#0b1c30] font-bold">الطلبات</span>
        </nav>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h1 className="text-2xl lg:text-[40px] font-bold text-[#0b1c30] tracking-tight leading-[1.15]">
              إدارة الطلبات
            </h1>
            <p className="text-[#45464d] mt-2 text-base lg:text-lg">
              تتبع وإدارة جميع طلبات متجرك.
            </p>
          </div>
        </div>

        <Suspense fallback={<OrderSkeleton />}>
          <OrderFetcher />
        </Suspense>
      </main>
    </div>
  );
}
