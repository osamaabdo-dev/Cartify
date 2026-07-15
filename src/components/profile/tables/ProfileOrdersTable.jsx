"use client";

import { ShoppingCart, Search, Eye, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { statusMap, formatCurrency } from "@/lib/utils/dashboardUtils";

export default function ProfileOrdersTable({ orders }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q),
    );
  }, [orders, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const startEntry = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <>
      <div className="luxury-card rounded-2xl p-5 lg:p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0b1c30] tracking-tight">طلباتي</h1>
            <p className="text-sm text-[#45464d] mt-1.5 font-medium">
              قائمة بجميع طلباتك السابقة
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="بحث برقم الطلب أو الحالة..."
              className="input-luxury pl-11"
            />
          </div>
        </div>
      </div>

      <div className="luxury-card rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
              <ShoppingCart size={36} className="text-[#94a3b8]" />
            </div>
            <p className="text-[#0b1c30] text-xl font-bold mb-2">
              {searchQuery ? "لا توجد طلبات مطابقة" : "لا توجد طلبات بعد"}
            </p>
            <p className="text-[#45464d] text-sm">
              {searchQuery ? "حاول تعديل معايير البحث." : "عندما تقوم بشراء منتجات ستظهر طلباتك هنا."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">رقم الطلب</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">المبلغ</th>
                    <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">عدد القطع</th>
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
                        <td className="py-4 text-sm font-bold text-[#775a19]">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4 text-sm text-[#45464d]">{order.itemsCount}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 ${status.bg} ${status.text} text-[10px] px-2.5 py-1 rounded-full font-bold`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity justify-start">
                            <Link
                              href={`/profile/orders/${order.id}`}
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
