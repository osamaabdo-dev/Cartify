"use client";

import { useEffect, useState, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCategoryAction } from "@/actions/categoryActions";
import Image from "next/image";
import {
  ChevronLeft, AlertCircle, Sparkles, Images,
  CloudUpload, Lightbulb, CheckCircle,
} from "lucide-react";

export function CategoryForm({ initialData, action, title, subtitle, submitLabel, isEdit = false }) {
  const router = useRouter();
  const boundAction = action ?? createCategoryAction;
  const [state, formAction, isPending] = useActionState(
    boundAction,
    { data: null, errors: {}, success: false, message: "" }
  );
  const [formValues, setFormValues] = useState(initialData || {});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (state?.data) {
      setFormValues(state.data);
    }
  }, [state?.data]);

  useEffect(() => {
    if (state.success) {
      setToast({ type: "success", message: isEdit ? "تم تحديث التصنيف بنجاح" : "تم إضافة التصنيف بنجاح" });
      const timer = setTimeout(() => {
        setToast(null);
        router.push("/admin/categories");
        router.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router, isEdit]);

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
        {initialData?.id && (
          <input type="hidden" name="categoryId" value={initialData.id} />
        )}
        <main className="flex-grow p-4 sm:p-6 lg:p-10 xl:p-16 max-w-7xl mx-auto">
          <div className="h-[3px] w-[60px] bg-gradient-to-l from-[#775a19] to-[#775a19]/20 rounded-full mb-6" />

          <nav className="flex items-center gap-2 text-sm text-[#45464d] mb-3">
            <Link href="/admin/categories" className="hover:text-[#775a19] transition-colors font-medium">التصنيفات</Link>
            <ChevronLeft size={14} />
            <span className="text-[#0b1c30] font-bold">{title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div>
              <h1 className="text-[34px] lg:text-[40px] font-bold text-[#0b1c30] tracking-tight leading-[1.15]">
                {title}
              </h1>
              <p className="text-[#45464d] mt-2 text-base lg:text-lg">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/admin/categories"
                className="px-8 py-[14px] rounded-xl border border-[#e2e8f0] text-[#45464d] font-bold hover:bg-[#f1f5f9] hover:border-[#cbd5e1] transition-all duration-200"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="px-10 py-[14px] rounded-xl bg-[#775a19] text-white font-bold shadow-lg shadow-[#775a19]/20 hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isPending ? (
                  <span className="flex items-center gap-2.5">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري الحفظ...
                  </span>
                ) : submitLabel}
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
                    معلومات التصنيف
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      اسم التصنيف
                    </label>
                    <input
                      name="name"
                      className="input-luxury"
                      placeholder="اكتب اسم التصنيف هنا"
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
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#0b1c30] tracking-wide">
                      الوصف (اختياري)
                    </label>
                    <textarea
                      name="description"
                      className="input-luxury resize-none min-h-[120px]"
                      placeholder="وصف مختصر لهذا التصنيف..."
                      rows="4"
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
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-10 space-y-10">
                <section className="luxury-card rounded-2xl p-8">
                  <div className="flex items-center gap-3 text-[#775a19] mb-8 section-underline">
                    <Images size={24} className="font-bold" />
                    <h2 className="text-xl font-bold tracking-tight text-[#0b1c30]">
                      صورة التصنيف
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
                      {imagePreview || initialData?.image ? (
                        <Image src={imagePreview || initialData.image} alt="معاينة" fill className="object-cover rounded-2xl" />
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
                        نصيحة: اختر صورة تعبر عن محتوى التصنيف لتسهيل التصفح.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <footer className="mt-16 pt-8 border-t border-[#e2e8f0] flex flex-wrap justify-end gap-4 pb-20">
            <Link
              href="/admin/categories"
              className="px-10 py-4 rounded-xl border border-[#e2e8f0] text-[#45464d] font-medium hover:bg-[#f1f5f9] transition-all duration-200"
            >
              إلغاء العملية
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-16 py-4 rounded-xl bg-[#775a19] text-white font-bold shadow-xl shadow-[#775a19]/15 hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isPending ? (
                <span className="flex items-center gap-2.5">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري الحفظ...
                </span>
              ) : submitLabel}
            </button>
          </footer>
        </main>
      </form>
    </div>
  );
}
