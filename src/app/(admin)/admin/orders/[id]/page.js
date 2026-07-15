import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, User, Phone, MapPin, CreditCard, ShoppingBag, Calendar, Package } from "lucide-react";
import { statusMap, formatCurrency } from "@/lib/utils/dashboardUtils";
import { updateOrderStatusAction } from "@/actions/orderActions";
import OrderStatusForm from "./OrderStatusForm";

export const dynamic = "force-dynamic";

const paymentLabels = {
  CARD: "بطاقة ائتمان",
  COD: "الدفع عند الاستلام",
};

const paymentStatusStyles = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
    },
  });

  if (!order) notFound();

  return (
    <div dir="rtl">
      <main className="flex-grow p-4 sm:p-6 lg:p-10 xl:p-16 max-w-7xl mx-auto">
        <div className="h-[3px] w-[60px] bg-gradient-to-l from-[#775a19] to-[#775a19]/20 rounded-full mb-6" />

        <nav className="flex items-center gap-2 text-sm text-[#45464d] mb-3">
          <Link href="/admin" className="hover:text-[#775a19] transition-colors font-medium">لوحة التحكم</Link>
          <ChevronLeft size={14} />
          <Link href="/admin/orders" className="hover:text-[#775a19] transition-colors font-medium">الطلبات</Link>
          <ChevronLeft size={14} />
          <span className="text-[#0b1c30] font-bold">{order.orderNumber}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="luxury-card rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fefce8] flex items-center justify-center">
                    <Package size={20} className="text-[#a16207]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0b1c30]">المنتجات</h2>
                    <p className="text-[10px] text-[#94a3b8]">{order.items.length} منتج</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-[#e2e8f0]/60">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 lg:p-6">
                    <div className="w-14 h-14 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product.images?.[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.name} width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-[#94a3b8]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0b1c30] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-[#94a3b8] mt-0.5">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#775a19] shrink-0">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-[#e2e8f0] bg-[#f8fafc]/40 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#45464d]">المجموع الفرعي</span>
                  <span className="font-bold text-[#0b1c30]">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#45464d]">الشحن</span>
                  <span className="font-bold text-[#0b1c30]">{formatCurrency(order.shipping)}</span>
                </div>
                {Number(order.tax) > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#45464d]">الضريبة</span>
                    <span className="font-bold text-[#0b1c30]">{formatCurrency(order.tax)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base pt-2 border-t border-[#e2e8f0]">
                  <span className="font-bold text-[#0b1c30]">الإجمالي</span>
                  <span className="font-bold text-[#775a19] text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="luxury-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
                  <User size={20} className="text-[#0284c7]" />
                </div>
                <h3 className="text-sm font-bold text-[#0b1c30]">معلومات العميل</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">الاسم</p>
                  <p className="text-sm font-bold text-[#0b1c30]">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">البريد الإلكتروني</p>
                  <p className="text-sm text-[#45464d]">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">رقم الهاتف</p>
                  <p className="text-sm text-[#45464d] font-mono" dir="ltr">{order.phone}</p>
                </div>
              </div>
            </div>

            <div className="luxury-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#fef2f2] flex items-center justify-center">
                  <MapPin size={20} className="text-[#dc2626]" />
                </div>
                <h3 className="text-sm font-bold text-[#0b1c30]">عنوان الشحن</h3>
              </div>
              <div className="space-y-3 text-sm text-[#45464d]">
                <p>{order.address}</p>
                <p>
                  {order.city}
                  {order.district && <> - {order.district}</>}
                </p>
                <p>{order.country}</p>
              </div>
            </div>

            <div className="luxury-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#faf5ff] flex items-center justify-center">
                  <CreditCard size={20} className="text-[#9333ea]" />
                </div>
                <h3 className="text-sm font-bold text-[#0b1c30]">الدفع والحالة</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">طريقة الدفع</p>
                  <p className="text-sm font-bold text-[#0b1c30]">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">حالة الدفع</p>
                  <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold mt-1 ${paymentStatusStyles[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                    {order.paymentStatus === "paid" ? "مدفوع" : order.paymentStatus === "pending" ? "قيد الانتظار" : "فشل"}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">حالة الطلب</p>
                  <div className="mt-1.5">
                    <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-[#94a3b8] font-bold tracking-wide">تاريخ الطلب</p>
                  <p className="text-sm text-[#45464d]">{order.createdAt.toISOString().split("T")[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
