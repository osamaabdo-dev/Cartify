import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/utils/authUtils";
import { n, formatCurrency, statusMap, formatDate } from "@/lib/utils/dashboardUtils";
import { DollarSign, ShoppingCart, CheckCircle, XCircle, ArrowLeft, ListOrdered } from "lucide-react";
import Link from "next/link";

export default async function ProfileDashboardFetcher() {
  const token = await getAuthToken();

  if (!token?.id) {
    return (
      <div className="py-24 text-center">
        <p className="text-[#45464d] text-lg">لم يتم العثور على بيانات المستخدم</p>
      </div>
    );
  }

  const userId = token.id;

  const [totalSpent, orderCounts, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { userId, status: { not: "CANCELLED" } },
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.order.findMany({
      select: { id: true, orderNumber: true, total: true, status: true, items: { select: { quantity: true } } },
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const spent = Number(totalSpent._sum.total ?? 0);

  const orderCountMap = Object.fromEntries(
    orderCounts.map((o) => [o.status, o._count])
  );
  const ordersCount = orderCounts.reduce((sum, o) => sum + o._count, 0);
  const pendingCount = orderCountMap.PENDING || 0;
  const processingCount = orderCountMap.PROCESSING || 0;
  const shippedCount = orderCountMap.SHIPPED || 0;
  const deliveredCount = orderCountMap.DELIVERED || 0;
  const cancelledCount = orderCountMap.CANCELLED || 0;
  const activeCount = pendingCount + processingCount + shippedCount;
  const today = formatDate(new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0b1c30] tracking-tight">ملفي الشخصي</h1>
        <p className="text-sm text-[#45464d] mt-1.5 font-medium">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fefce8] flex items-center justify-center">
              <DollarSign size={24} className="text-[#a16207]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي المشتريات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">{formatCurrency(spent)}</p>
          <div className="mt-3 text-xs text-[#45464d]">
            بدون الطلبات الملغاة
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
              <ShoppingCart size={24} className="text-[#0284c7]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي الطلبات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">{n(ordersCount)}</p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#45464d]">{deliveredCount} مكتمل</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[#45464d]">{activeCount} قيد التنفيذ</span>
            </span>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircle size={24} className="text-[#16a34a]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">الطلبات المكتملة</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">{n(deliveredCount)}</p>
          <div className="mt-3 text-xs text-[#45464d]">
            من إجمالي {n(ordersCount)} طلب
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fef2f2] flex items-center justify-center">
              <XCircle size={24} className="text-[#dc2626]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">الطلبات الملغاة</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">{n(cancelledCount)}</p>
          <div className="mt-3 text-xs text-[#45464d]">
            بنسبة {ordersCount > 0 ? Math.round((cancelledCount / ordersCount) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="luxury-card rounded-2xl p-5 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-[#0b1c30] section-underline">آخر طلباتي</h3>
          {ordersCount > 5 && (
            <Link
              href="/profile/orders"
              className="text-xs font-bold text-[#775a19] flex items-center gap-1 hover:underline"
            >
              <ArrowLeft size={14} />
              عرض الكل
            </Link>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#e2e8f0]">
                <th className="py-3 text-xs font-bold text-[#45464d] tracking-wide">رقم الطلب</th>
                <th className="py-3 text-xs font-bold text-[#45464d] tracking-wide">المبلغ</th>
                <th className="py-3 text-xs font-bold text-[#45464d] tracking-wide">عدد القطع</th>
                <th className="py-3 text-xs font-bold text-[#45464d] tracking-wide">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]/60">
              {recentOrders.map((order) => {
                const status = statusMap[order.status] ?? statusMap.PENDING;
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                return (
                  <tr key={order.id} className="hover:bg-[#f8fafc]/60 transition-colors">
                    <td className="py-3.5 text-xs font-bold text-[#0b1c30]">{order.orderNumber}</td>
                    <td className="py-3.5 text-xs font-bold text-[#775a19]">{formatCurrency(order.total)}</td>
                    <td className="py-3.5 text-xs text-[#45464d]">{itemCount}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 ${status.bg} ${status.text} text-[10px] px-2.5 py-1 rounded-full font-bold`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[#94a3b8]">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
