import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, ShoppingBag, Calendar } from "lucide-react";
import { roleStyles, statusMap as statusStyles, n, formatCurrency } from "@/lib/utils/dashboardUtils";

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({ params }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: { select: { quantity: true, price: true } },
        },
      },
    },
  });

  if (!user) notFound();

  return (
    <div dir="rtl">
      <main className="flex-grow p-4 sm:p-6 lg:p-10 xl:p-16 max-w-7xl mx-auto">
        <div className="h-[3px] w-[60px] bg-gradient-to-l from-[#775a19] to-[#775a19]/20 rounded-full mb-6" />

        <nav className="flex items-center gap-2 text-sm text-[#45464d] mb-3">
          <Link href="/admin" className="hover:text-[#775a19] transition-colors font-medium">لوحة التحكم</Link>
          <ChevronLeft size={14} />
          <Link href="/admin/users" className="hover:text-[#775a19] transition-colors font-medium">الأعضاء</Link>
          <ChevronLeft size={14} />
          <span className="text-[#0b1c30] font-bold">{user.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="luxury-card rounded-2xl p-6 lg:p-8 sticky top-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#fefce8] border border-[#fde68a]/50 flex items-center justify-center text-3xl font-bold text-[#a16207] mb-4">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-[#0b1c30]">{user.name}</h2>
                <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold mt-2 ${roleStyles[user.role] || "bg-gray-100 text-gray-600"}`}>
                  {user.role === "ADMIN" ? "مدير" : "مستخدم"}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="bg-[#f8fafc] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#0284c7]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">البريد الإلكتروني</p>
                    <p className="text-sm font-bold text-[#0b1c30] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#fef2f2] flex items-center justify-center shrink-0">
                    <ShoppingBag size={18} className="text-[#dc2626]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">عدد الطلبات</p>
                    <p className="text-sm font-bold text-[#0b1c30]">{user._count.orders}</p>
                  </div>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#faf5ff] flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-[#9333ea]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">تاريخ التسجيل</p>
                    <p className="text-sm font-bold text-[#0b1c30]">{user.createdAt.toISOString().split("T")[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="luxury-card rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[#e2e8f0]">
                <h3 className="text-base font-bold text-[#0b1c30]">طلبات العضو</h3>
              </div>

              {user.orders.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
                    <ShoppingBag size={28} className="text-[#94a3b8]" />
                  </div>
                  <p className="text-[#0b1c30] text-base font-bold mb-1">لا توجد طلبات</p>
                  <p className="text-[#94a3b8] text-sm">هذا العضو لم يقم بأي طلبات بعد.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="border-b border-[#e2e8f0]">
                        <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">رقم الطلب</th>
                        <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">المبلغ</th>
                        <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">عدد القطع</th>
                        <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">طريقة الدفع</th>
                        <th className="py-4 pl-6 text-xs font-bold text-[#45464d] tracking-wide">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]/60">
                      {user.orders.map((order) => {
                        const status = statusStyles[order.status] ?? statusStyles.PENDING;
                        const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                        return (
                          <tr key={order.id} className="hover:bg-[#f8fafc]/60 transition-colors">
                            <td className="py-3.5 pr-6 text-xs font-bold text-[#0b1c30]">{order.orderNumber}</td>
                            <td className="py-3.5 text-xs font-bold text-[#775a19]">{formatCurrency(order.total)}</td>
                            <td className="py-3.5 text-xs text-[#45464d]">{itemCount}</td>
                            <td className="py-3.5 text-xs text-[#45464d]">{order.paymentMethod === "CARD" ? "بطاقة ائتمان" : "الدفع عند الاستلام"}</td>
                            <td className="py-3.5 pl-6">
                              <span className={`inline-flex items-center gap-1.5 ${status.bg} ${status.text} text-[10px] px-2.5 py-1 rounded-full font-bold`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
