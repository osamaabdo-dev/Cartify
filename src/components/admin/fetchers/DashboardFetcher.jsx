import { prisma } from "@/lib/prisma";
import { n, formatCurrency, statusMap, formatDate } from "@/lib/utils/dashboardUtils";
import { DollarSign, ShoppingCart, Package, Users, Star, AlertTriangle, Tags, ArrowLeft, PackagePlus, ListOrdered } from "lucide-react";
import Link from "next/link";

export default async function DashboardFetcher() {
  const [
    totalRevenue,
    ordersCount,
    totalProducts,
    totalUsers,
    totalCategories,
    recentOrders,
    featuredCount,
    lowStockCount,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalStock,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: { select: { quantity: true } } },
    }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.product.aggregate({ _sum: { stock: true } }),
  ]);

  const revenue = Number(totalRevenue._sum.total ?? 0);
  const totalItemsInOrders = totalStock._sum.stock ?? 0;

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" }, createdAt: { gte: lastMonth } },
  });
  const prevRevenue = Number(lastMonthRevenue._sum.total ?? 0);

  const today = formatDate(new Date());

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0b1c30] tracking-tight">لوحة التحكم</h1>
          <p className="text-sm text-[#45464d] mt-1.5 font-medium">{today}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#775a19] text-white font-bold text-sm shadow-lg shadow-[#775a19]/20 hover:shadow-xl hover:brightness-110 transition-all duration-200"
          >
            <PackagePlus size={17} />
            إضافة منتج
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fefce8] flex items-center justify-center">
              <DollarSign size={24} className="text-[#a16207]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي المبيعات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {formatCurrency(revenue)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#45464d]">
            <span className="text-emerald-600 font-bold">{prevRevenue > 0 ? "+" : ""}{prevRevenue > 0 ? Math.round((revenue - prevRevenue) / prevRevenue * 100) : 100}%</span>
            <span>خلال آخر 30 يوم</span>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
              <ShoppingCart size={24} className="text-[#0284c7]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي الطلبات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {n(ordersCount)}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#45464d]">{deliveredOrders} مكتمل</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[#45464d]">{pendingOrders + processingOrders} قيد الانتظار</span>
            </span>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#faf5ff] flex items-center justify-center">
              <Package size={24} className="text-[#9333ea]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي المنتجات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {n(totalProducts)}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Star size={13} className="text-[#a16207]" />
              <span className="text-[#45464d]">{featuredCount} مميز</span>
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle size={13} className="text-rose-500" />
              <span className="text-[#45464d]">{lowStockCount} مخزون منخفض</span>
            </span>
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fef2f2] flex items-center justify-center">
              <Users size={24} className="text-[#dc2626]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">الأعضاء</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {n(totalUsers)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#45464d]">
            {totalCategories} قسم
            <span className="text-[#cbd5e1]">·</span>
            {n(totalItemsInOrders)} وحدة مخزون
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="luxury-card rounded-2xl p-5 lg:col-span-1">
          <h3 className="text-sm font-bold text-[#0b1c30] mb-5 section-underline">حالة الطلبات</h3>
          <div className="space-y-3.5">
            {[
              { label: "قيد الانتظار", count: pendingOrders, color: "bg-amber-400", bar: "bg-amber-400" },
              { label: "قيد المعالجة", count: processingOrders, color: "bg-blue-400", bar: "bg-blue-400" },
              { label: "قيد التوصيل", count: shippedOrders, color: "bg-indigo-400", bar: "bg-indigo-400" },
              { label: "مكتمل", count: deliveredOrders, color: "bg-emerald-400", bar: "bg-emerald-400" },
              { label: "ملغى", count: cancelledOrders, color: "bg-rose-400", bar: "bg-rose-400" },
            ].map((s) => {
              const pct = ordersCount > 0 ? Math.round((s.count / ordersCount) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-xs text-[#45464d] font-medium">{s.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30]">{s.count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                    <div className={`h-full rounded-full ${s.bar} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="luxury-card rounded-2xl p-5 lg:p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-[#0b1c30] section-underline">آخر الطلبات</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#775a19] flex items-center gap-1 hover:underline"
            >
              <ArrowLeft size={14} />
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="py-3 text-xs font-bold text-[#45464d] tracking-wide">رقم الطلب</th>
                  <th className="py-3 text-xs font-bold text-[#45464d] tracking-wide">العميل</th>
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
                      <td className="py-3.5 text-xs text-[#45464d]">{order.customerName}</td>
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
                    <td colSpan={5} className="py-12 text-center text-sm text-[#94a3b8]">
                      لا توجد طلبات بعد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#0b1c30] mb-5 section-underline">روابط سريعة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: "/admin/products", label: "إدارة المنتجات", icon: Package, color: "bg-[#faf5ff]", iconColor: "text-[#9333ea]" },
            { href: "/admin/categories", label: "إدارة الأقسام", icon: Tags, color: "bg-[#fefce8]", iconColor: "text-[#a16207]" },
            { href: "/admin/orders", label: "إدارة الطلبات", icon: ListOrdered, color: "bg-[#f0f9ff]", iconColor: "text-[#0284c7]" },
            { href: "/admin/users", label: "إدارة الأعضاء", icon: Users, color: "bg-[#fef2f2]", iconColor: "text-[#dc2626]" },
          ].map(({ href, label, icon: Icon, color, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="luxury-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={22} className={iconColor} />
              </div>
              <span className="text-sm font-bold text-[#0b1c30]">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
