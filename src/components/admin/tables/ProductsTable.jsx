"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Search, Image as ImageIcon,
  Package, Pencil, Trash2, AlertCircle, Star, Eye, EyeOff, ExternalLink,
} from "lucide-react";
import Image from "next/image";
import {
  deleteProductAction,
  toggleProductFeaturedAction,
  toggleProductArchivedAction,
} from "@/actions/productActions";
import {
  formatPrice,
  getStockInfo,
  getStockOptions,
  getMetrics,
  filterProducts,
  paginateItems,
  metricCards,
} from "@/lib/utils/productUtils";

function DeleteButton({ productId, orderCount }) {
  const router = useRouter();
  const [showBlocked, setShowBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData();
    formData.set("productId", productId);

    const result = await deleteProductAction(formData);

    if (result.success) {
      router.refresh();
    } else if (result.orderCount > 0) {
      setPending(false);
      setShowConfirm(false);
    } else {
      setError(result.message || "فشل الحذف");
      setPending(false);
      setShowConfirm(false);
    }
  };

  const handleClick = () => {
    if (orderCount > 0) {
      setShowBlocked(true);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#dc2626] hover:bg-[#fef2f2] hover:border-[#fecaca] transition-all duration-200 text-sm font-semibold cursor-pointer"
        title={orderCount > 0 ? "لا يمكن الحذف" : "حذف"}
      >
        <Trash2 size={14} />
        حذف
      </button>

      {showBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-[#dc2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] text-center mb-2">
              لا يمكن الحذف
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-2">
              هذا المنتج موجود في{" "}
              <span className="font-bold text-[#0b1c30]">{orderCount}</span>{" "}
              طلب.
            </p>
            <p className="text-[#94a3b8] text-sm text-center mb-6">
              لا يمكن حذف منتج مرتبط بطلبات سابقة.
            </p>
            <button
              onClick={() => setShowBlocked(false)}
              className="w-full px-6 py-3 rounded-xl bg-[#775a19] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-[#dc2626]" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] text-center mb-2">
              حذف المنتج
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-6">
              هل أنت متأكد من حذف هذا المنتج؟
            </p>
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] font-medium text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setError(""); }}
                disabled={pending}
                className="flex-1 px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#45464d] font-bold hover:bg-[#f1f5f9] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                className="flex-1 px-6 py-3 rounded-xl bg-[#dc2626] text-white font-bold shadow-lg hover:bg-[#b91c1c] transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {pending ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleFeaturedButton({ productId, isFeatured }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    const formData = new FormData();
    formData.set("productId", productId);
    await toggleProductFeaturedAction(formData);
    setPending(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 text-sm font-semibold cursor-pointer disabled:opacity-50 ${
        isFeatured
          ? "bg-[#fffbeb] border-[#fbbf24] text-[#d97706] hover:bg-[#fef3c7]"
          : "bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569]"
      }`}
      title={isFeatured ? "إلغاء التميز" : "جعله مميزاً"}
    >
      <Star size={14} className={isFeatured ? "fill-[#d97706]" : ""} />
      {isFeatured ? "إلغاء التميز" : "جعله مميزاً"}
    </button>
  );
}

function ToggleArchiveButton({ productId, isArchived }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    const formData = new FormData();
    formData.set("productId", productId);
    await toggleProductArchivedAction(formData);
    setPending(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 text-sm font-semibold cursor-pointer disabled:opacity-50 ${
        isArchived
          ? "bg-[#fef2f2] border-[#fecaca] text-[#dc2626] hover:bg-[#fee2e2]"
          : "bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569]"
      }`}
      title={isArchived ? "إظهار المنتج" : "إخفاء المنتج"}
    >
      {isArchived ? <EyeOff size={14} /> : <Eye size={14} />}
      {isArchived ? "إظهار" : "إخفاء"}
    </button>
  );
}

export default function ProductsTable({ products, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = useMemo(
    () => filterProducts(products, { searchQuery, categoryFilter, statusFilter }),
    [products, searchQuery, categoryFilter, statusFilter]
  );

  const { paginatedItems, totalPages } = useMemo(
    () => paginateItems(filtered, currentPage, itemsPerPage),
    [filtered, currentPage]
  );

  const metrics = useMemo(() => getMetrics(products), [products]);

  const startEntry = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {metricCards.map((card) => {
          const Icon = card.Icon;
          return (
            <div key={card.key} className="luxury-card rounded-2xl p-5 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon size={24} className={card.iconColor} />
                </div>
                <span className="text-xs text-[#45464d] font-medium tracking-wide">{card.label}</span>
              </div>
              <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
                {metrics[card.key]}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث عن منتج..."
            className="input-luxury pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="input-luxury appearance-none bg-transparent min-w-[180px] flex-1"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === "الكل" ? "جميع التصنيفات" : cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="input-luxury appearance-none bg-transparent min-w-[180px] flex-1"
          >
            {getStockOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="luxury-card rounded-2xl overflow-hidden">
        {paginatedItems.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
              <Package size={36} className="text-[#94a3b8]" />
            </div>
            <p className="text-[#0b1c30] text-xl font-bold mb-2">
              {products.length === 0 ? "لا توجد منتجات بعد" : "لا توجد منتجات مطابقة"}
            </p>
            <p className="text-[#45464d] text-sm">
              {products.length === 0 ? "أضف منتجاً جديداً للبدء." : "حاول تعديل معايير البحث أو التصفية."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">المنتج</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">التصنيف</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">السعر</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">المخزون</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">الحالة</th>
                  <th className="py-4 pl-6 text-xs font-bold text-[#45464d] tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {paginatedItems.map((product) => {
                  const stockInfo = getStockInfo(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-[#f8fafc]/60 transition-colors group">
                      <td className="py-5 pr-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center shrink-0 overflow-hidden">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#94a3b8]">
                                <ImageIcon size={22} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#0b1c30] text-sm">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-sm text-[#45464d]">{product.categoryName}</span>
                      </td>
                      <td className="py-5">
                        <span className="font-bold text-[#0b1c30] text-sm">{formatPrice(product.price)}</span>
                      </td>
                      <td className="py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${stockInfo.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stockInfo.dot}`} />
                          {stockInfo.label}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex flex-row gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold w-fit ${
                            product.isFeatured
                              ? "bg-[#fffbeb] text-[#d97706]"
                              : "bg-[#f1f5f9] text-[#94a3b8]"
                          }`}>
                            <Star size={11} className={product.isFeatured ? "fill-[#d97706]" : ""} />
                            {product.isFeatured ? "مميز" : "عادي"}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold w-fit ${
                            product.isArchived
                              ? "bg-[#fef2f2] text-[#dc2626]"
                              : "bg-[#f0fdf4] text-[#16a34a]"
                          }`}>
                            {product.isArchived ? <EyeOff size={11} /> : <Eye size={11} />}
                            {product.isArchived ? "غير مرئي" : "مرئي"}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 pl-6">
                        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity flex-wrap">
                          <ToggleFeaturedButton productId={product.id} isFeatured={product.isFeatured} />
                          <ToggleArchiveButton productId={product.id} isArchived={product.isArchived} />
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 text-sm font-semibold"
                          >
                            <Pencil size={14} />
                            تعديل
                          </Link>
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] hover:bg-[#e0f2fe] hover:border-[#7dd3fc] transition-all duration-200 text-sm font-semibold"
                          >
                            <ExternalLink size={14} />
                            عرض
                          </Link>
                          <DeleteButton productId={product.id} orderCount={0} />
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
                منتج
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
