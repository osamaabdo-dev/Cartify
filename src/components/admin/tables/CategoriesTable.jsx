"use client";

import { Package, Tags, Pencil, Trash2, Search, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { deleteCategoryAction } from "@/actions/categoryActions";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

function DeleteButton({ categoryId, productCount }) {
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
    formData.set("categoryId", categoryId);

    const result = await deleteCategoryAction(formData);

    if (result.success) {
      router.refresh();
    } else if (result.productCount > 0) {
      setPending(false);
      setShowConfirm(false);
    } else {
      setError(result.message || "فشل الحذف");
      setPending(false);
      setShowConfirm(false);
    }
  };

  const handleClick = () => {
    if (productCount > 0) {
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
        title={productCount > 0 ? "لا يمكن الحذف" : "حذف"}
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
              هذا التصنيف يحتوي على{" "}
              <span className="font-bold text-[#0b1c30]">{productCount}</span>{" "}
              منتج.
            </p>
            <p className="text-[#94a3b8] text-sm text-center mb-6">
              قم بنقل المنتجات إلى تصنيف آخر أولاً.
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
              حذف التصنيف
            </h3>
            <p className="text-[#45464d] text-sm text-center mb-6">
              هل أنت متأكد من حذف هذا التصنيف؟
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

export default function CategoriesTable({ categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat._count?.products ?? 0),
    0
  );

  const startEntry = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#fefce8] flex items-center justify-center">
              <Tags size={24} className="text-[#a16207]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي الأقسام</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {categories.length}
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#f0f9ff] flex items-center justify-center">
              <Package size={24} className="text-[#0284c7]" />
            </div>
            <span className="text-xs text-[#45464d] font-medium tracking-wide">إجمالي المنتجات</span>
          </div>
          <p className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
            {totalProducts}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث عن تصنيف..."
            className="input-luxury pl-11"
          />
        </div>
      </div>

      <div className="luxury-card rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#f1f5f9] flex items-center justify-center">
              <Tags size={36} className="text-[#94a3b8]" />
            </div>
            <p className="text-[#0b1c30] text-xl font-bold mb-2">
              {searchQuery ? "لا توجد تصنيفات مطابقة" : "لا توجد تصنيفات بعد"}
            </p>
            <p className="text-[#45464d] text-sm">
              {searchQuery ? "حاول تعديل معايير البحث." : "أضف تصنيفاً جديداً لتنظيم منتجاتك."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="py-4 pr-6 text-xs font-bold text-[#45464d] tracking-wide">التصنيف</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">الصورة</th>
                  <th className="py-4 text-xs font-bold text-[#45464d] tracking-wide">المنتجات</th>
                  <th className="py-4 pl-6 text-xs font-bold text-[#45464d] tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]/60">
                {paginated.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#f8fafc]/60 transition-colors group">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#fefce8] border border-[#fde68a]/50 flex items-center justify-center shrink-0">
                          <Tags size={16} className="text-[#a16207]" />
                        </div>
                        <span className="font-bold text-[#0b1c30] text-sm">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} width={48} height={48} className="w-12 h-12 rounded-xl object-cover border border-[#e2e8f0]" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
                          <Tags size={16} className="text-[#94a3b8]" />
                        </div>
                      )}
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-[#45464d]">{cat._count?.products ?? 0}</span>
                    </td>
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity justify-start">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 text-sm font-semibold"
                        >
                          <Pencil size={14} />
                          تعديل
                        </Link>
                        <DeleteButton categoryId={cat.id} productCount={cat._count?.products ?? 0} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f8fafc]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-[#45464d]">
                عرض <span className="font-bold text-[#0b1c30]">{startEntry}</span>{" "}
                إلى <span className="font-bold text-[#0b1c30]">{endEntry}</span>{" "}
                من <span className="font-bold text-[#0b1c30]">{filtered.length}</span>{" "}
                تصنيف
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
