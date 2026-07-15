"use client";

import { ShoppingCart, DollarSign, Clock, CheckCircle, Search, Eye, ChevronRight, ChevronLeft, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { statusMap, formatCurrency } from "@/lib/utils/dashboardUtils";

const paymentLabels = {
  CARD: "بطاقة ائتمان",
  COD: "الدفع عند الاستلام",
};

const paymentStyles = {
  CARD: "bg-purple-50 text-purple-700 border border-purple-200",
  COD: "bg-teal-50 text-teal-700 border border-teal-200",
};

export default function OrdersTable({ orders }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = orders;
    if (q) {
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }
    return result;
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);
  const completedCount = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;

  const startEntry = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
              <ShoppingCart size={24} className="text-[#0284c7]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي الطلبات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {orders.length.toLocaleString("en-US")}
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fefce8] flex items-center justify-center">
              <DollarSign size={24} className="text-[#a16207]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي المبيعات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fef2f2] flex items-center justify-center">
              <Clock size={24} className="text-[#dc2626]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">قيد المعالجة</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {pendingCount.toLocaleString("en-US")}
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircle size={24} className="text-[#16a34a]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">مكتمل</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {completedCount.toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث عن رقم طلب، عميل، بريد إلكتروني..."
            className="input-luxury pl-11"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="input-luxury pl-10 pr-4 appearance-none bg-white min-w-[160px] cursor-pointer"
          >
            <option value="ALL">جميع الحالات</option>
            {Object.entries(statusMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="luxury-card rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
              <ShoppingCart size={36} className="text-[#94a3b8]" />
            </div>
            <p className="text-[#0b1c30] text-xl font-bold mb-2">
              {searchQuery || statusFilter !== "ALL" ? "لا توجد طلبات مطابقة" : "لا توجد طلبات بعد"}
            </p>
            <p className="text-[#45464d] text-sm">
              {searchQuery || statusFilter !== "ALL" ? "حاول تعديل معايير البحث." : "عندما يتم تقديم الطلبات ستظهر هنا."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">رقم الطلب</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">العميل</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">الهاتف</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">المدينة</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">المبلغ</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">طريقة الدفع</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">الحالة</th>
                    <th className="py-4 pl-6 text-xs font-bold text-[#45464d] tracking-wide">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]/60">
                  {paginated.map((order) => {
                    const status = statusMap[order.status] ?? statusMap.PENDING;
                    return (
                      <tr key={order.id} className="hover:bg-[#f8fafc]/60 transition-colors group">
                        <td className="py-4 pr-6">
                          <span className="font-bold text-[#0b1c30] text-sm font-mono" dir="ltr">
                            {order.orderNumber}
                          </span>
                        </td>
                        <td className="py-4">
                          <div>
                            <span className="text-sm font-bold text-[#0b1c30]">{order.customerName}</span>
                            <span className="block text-[10px] text-[#94a3b8] mt-0.5">{order.customerEmail}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-[#45464d] font-mono" dir="ltr">{order.phone}</td>
                        <td className="py-4 text-sm text-[#45464d]">
                          {order.city}
                          {order.district && <span className="text-[#94a3b8]"> - {order.district}</span>}
                        </td>
                        <td className="py-4 text-sm font-bold text-[#775a19]">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4">
                          <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold ${paymentStyles[order.paymentMethod] || "bg-gray-100 text-gray-600"}`}>
                            {paymentLabels[order.paymentMethod] || order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 ${status.bg} ${status.text} text-[10px] px-2.5 py-1 rounded-full font-bold`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity justify-start">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 text-sm font-semibold"
                            >
                              <Eye size={14} />
                              عرض
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-[#45464d]">
                عرض <span className="font-bold text-[#0b1c30]">{startEntry}</span>{" "}
                إلى <span className="font-bold text-[#0b1c30]">{endEntry}</span>{" "}
                من <span className="font-bold text-[#0b1c30]">{filtered.length}</span>{" "}
                طلب
              </span>
              {totalPages > 1 && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] text-[#45464d] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                        page === currentPage
                          ? "bg-[#775a19] text-white shadow-md shadow-[#775a19]/20"
                          : "border border-[#e2e8f0] text-[#45464d] hover:bg-[#f1f5f9] hover:border-[#cbd5e1]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] text-[#45464d] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
