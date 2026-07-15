"use client";

import { useEffect, useState, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import Image from "next/image";
import {
  ChevronLeft, AlertCircle, Sparkles, ChevronDown, Tag, Images,
  CloudUpload, Lightbulb, CheckCircle,
} from "lucide-react";

export default function ProductForm({ action, initial = null, categories = [] }) {
  const isEditing = initial !== null;
  const router = useRouter();
  const defaultData = initial || {};

  const [state, formAction, isPending] = useActionState(action, {
    data: defaultData,
    errors: {},
    success: false,
    message: "",
  });

  const [formValues, setFormValues] = useState(defaultData);
  const [imagePreview, setImagePreview] = useState(
    isEditing ? (initial.images?.[0] || null) : null
  );
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (state?.data) {
      setFormValues(state.data);
    }
  }, [state?.data]);

  useEffect(() => {
    if (state.success) {
      setToast({
        type: "success",
        message: isEditing ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح",
      });
      const timer = setTimeout(() => {
        setToast(null);
        router.push("/admin/products");
        router.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div dir="rtl">
      {toast && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-auto">
          <div className="animate-[slideDown_0.3s_ease-out] bg-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm sm:text-base font-bold whitespace-nowrap">
            <CheckCircle size={22} />
            {toast.message}
          </div>
        </div>
      )}
      <form action={formAction}>
        {isEditing && <input type="hidden" name="productId" value={initial.id} />}
        <div className="flex-grow p-4 sm:p-6 lg:p-10 xl:p-16 max-w-7xl mx-auto">
          <div className="h-[3px] w-[60px] bg-gradient-to-l from-[#775a19] to-[#775a19]/20 rounded-full mb-6" />

          <nav className="flex items-center gap-2 text-sm text-[#45464d] mb-3">
            <Link href="/admin/products" className="hover:text-[#775a19] transition-colors font-medium">
              المخزون
            </Link>
            <ChevronLeft size={14} />
            <span className="text-[#0b1c30] font-bold">
              {isEditing ? "تعديل المنتج" : "إضافة منتج"}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div>
              <h1 className="text-2xl lg:text-[40px] font-bold text-[#0b1c30] tracking-tight leading-[1.15]">
                {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h1>
              <p className="text-[#45464d] mt-2 text-base lg:text-lg">
                {isEditing ? "قم بتحديث معلومات المنتج." : "أضف منتج جديد لمتجرك."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/admin/products"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#45464d] font-bold hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200 text-sm text-center"
              >
                تجاهل التغييرات
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#775a19] text-white font-bold shadow-lg shadow-[#775a19]/20 hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
              >
                {isPending ? (
                  <span className="flex items-center gap-2.5">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري الحفظ...
                  </span>
                ) : (
                  isEditing ? "حفظ التغييرات" : "نشر المنتج"
                )}
              </button>
            </div>
          </div>

          {state?.message && !state.success && (
            <div className="p-4 mb-8 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] font-medium text-sm flex items-center gap-3">
              <AlertCircle size={18} />
              {state.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <section className="luxury-card rounded-2xl p-10">
                <div className="flex items-center gap-3 text-[#775a19] mb-10 section-underline">
                  <Sparkles size={24} className="font-bold" />
                  <h2 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
                    المعلومات الأساسية
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      اسم المنتج
                    </label>
                    <input
                      name="name"
                      className="input-luxury"
                      placeholder="اكتب اسم منتجك هنا"
                      type="text"
                      value={formValues?.name || ""}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                    {state?.errors?.name && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      التصنيف الرئيسي
                    </label>
                    <div className="relative">
                      <select
                        name="categoryId"
                        className="input-luxury appearance-none bg-transparent"
                        value={formValues?.categoryId || ""}
                        onChange={handleChange}
                        disabled={isPending}
                      >
                        <option value="">اختر التصنيف</option>
                        {categories.length > 0
                          ? categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))
                          : (
                            <>
                              <option value="عطور فاخرة">عطور فاخرة</option>
                              <option value="هدايا خاصة">هدايا خاصة</option>
                              <option value="بخور وعود">بخور وعود</option>
                              <option value="مجموعات موسمية">مجموعات موسمية</option>
                            </>
                          )
                        }
                      </select>
                      <ChevronDown size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                    </div>
                    {state?.errors?.categoryId && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.categoryId}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      الرابط المختصر (Slug)
                    </label>
                    <input
                      name="slug"
                      className="input-luxury font-mono text-sm dir-ltr text-left"
                      placeholder="product-name"
                      type="text"
                      dir="ltr"
                      value={formValues?.slug || ""}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                    {state?.errors?.slug && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.slug}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                        وصف المنتج
                      </label>
                    </div>
                    <textarea
                      name="description"
                      className="input-luxury resize-none min-h-[140px]"
                      placeholder="اروي قصة هذا المنتج لعملائك بطريقة تشوقهم..."
                      rows="5"
                      value={formValues?.description || ""}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                    {state?.errors?.description && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="luxury-card rounded-2xl p-10">
                <div className="flex items-center gap-3 text-[#775a19] mb-10 section-underline">
                  <Tag size={24} className="font-bold" />
                  <h2 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
                    التسعير والمخزون
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      السعر الأساسي ({APP_CONFIG.currency})
                    </label>
                    <div className="relative">
                      <input
                        name="price"
                        className="input-luxury pl-14"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formValues?.price || ""}
                        onChange={handleChange}
                        disabled={isPending}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94a3b8] uppercase tracking-wider bg-[#f8fafc] px-1.5 py-0.5 rounded">
                        {APP_CONFIG.currency}
                      </span>
                    </div>
                    {state?.errors?.price && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.price}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      سعر العرض / الخصم (اختياري)
                    </label>
                    <div className="relative">
                      <input
                        name="sale_price"
                        className="input-luxury pl-14"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formValues?.sale_price ?? ""}
                        onChange={handleChange}
                        disabled={isPending}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94a3b8] uppercase tracking-wider bg-[#f8fafc] px-1.5 py-0.5 rounded">
                        {APP_CONFIG.currency}
                      </span>
                    </div>
                    {state?.errors?.sale_price && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.sale_price}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      الكمية المتوفرة
                    </label>
                    <input
                      name="stock"
                      className="input-luxury"
                      placeholder="0"
                      type="number"
                      value={formValues?.stock || ""}
                      onChange={handleChange}
                      disabled={isPending}
                    />
                    {state?.errors?.stock && (
                      <p className="text-xs text-[#dc2626] font-medium mt-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        {state.errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-10 space-y-10">
                <section className="luxury-card rounded-2xl p-8">
                  <div className="flex items-center gap-3 text-[#775a19] mb-8 section-underline">
                    <Images size={24} className="font-bold" />
                    <h2 className="text-xl font-bold tracking-tight text-[#0b1c30]">
                      صور المنتج
                    </h2>
                  </div>
                  <div className="space-y-5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImagePreview(URL.createObjectURL(file));
                      }}
                      disabled={isPending}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#e2e8f0] rounded-2xl aspect-square flex flex-col items-center justify-center text-center p-8 bg-[#f8fafc]/40 hover:bg-[#f1f5f9] hover:border-[#775a19] transition-all duration-300 cursor-pointer group overflow-hidden relative"
                    >
                      {imagePreview ? (
                        <Image src={imagePreview} alt="معاينة" fill className="object-cover rounded-2xl" />
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                            <CloudUpload size={36} className="text-[#775a19]" />
                          </div>
                          <p className="font-bold text-[#0b1c30] mb-2 text-lg">
                            الصورة الرئيسية
                          </p>
                          <p className="text-xs text-[#94a3b8] leading-relaxed">
                            اسحب الملف هنا أو انقر للتصفح
                            <br />
                            PNG, JPG (بحد أقصى 5MB)
                          </p>
                        </>
                      )}
                    </div>
                    <div className="bg-[#fefce8]/60 p-4 rounded-xl border border-[#fde68a]/50 flex items-start gap-3">
                      <Lightbulb size={18} className="text-[#a16207] shrink-0" />
                      <p className="text-[11px] text-[#713f12] font-medium leading-relaxed">
                        نصيحة: الصور عالية الجودة بخلفية بيضاء أو طبيعية ناعمة
                        تزيد من جاذبية منتجات ليفان الفاخرة.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <footer className="mt-16 pt-8 border-t border-[#e2e8f0] flex flex-col sm:flex-row justify-end gap-3 pb-20">
            <Link
              href="/admin/products"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#e2e8f0] text-[#45464d] font-medium hover:bg-[#f1f5f9] transition-all duration-200 text-sm text-center"
            >
              إلغاء العملية
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#775a19] text-white font-bold shadow-xl shadow-[#775a19]/15 hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
            >
              {isPending ? (
                <span className="flex items-center gap-2.5">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري الحفظ...
                </span>
              ) : (
                isEditing ? "نشر التعديلات" : "نشر المنتج"
              )}
            </button>
          </footer>
        </div>
      </form>
    </div>
  );
}
