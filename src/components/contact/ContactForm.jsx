"use client";

import { useActionState, useState, useEffect } from "react";
import { Send, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactMessageAction } from "@/actions/contactActions";

const FIELDS = [
  { name: "name", label: "الاسم الكامل", type: "text", placeholder: "مثال: أحمد العلي" },
  { name: "phone", label: "رقم الهاتف", type: "tel", placeholder: "+966 50 000 0000", ltr: true },
];

const initialState = { success: false, errors: {}, message: "" };

const EMPTY = { name: "", phone: "", email: "", message: "" };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessageAction, initialState);
  const [values, setValues] = useState(EMPTY);

  const { errors = {}, success, message } = state || {};

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (success) {
      setValues(EMPTY);
    }
  }, [success]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FIELDS.map(({ name, label, type, placeholder, ltr }) => (
          <div key={name} className="space-y-2">
            <label className="block text-body-sm font-bold text-on-surface" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={values[name]}
              onChange={handleChange}
              placeholder={placeholder}
              dir={ltr ? "ltr" : undefined}
              className={`w-full px-4 py-3 rounded-lg border bg-surface text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none ${
                errors[name] ? "border-[#dc2626]" : "border-outline-variant"
              }`}
            />
            {errors[name] && (
              <p className="text-[#dc2626] text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-body-sm font-bold text-on-surface" htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="example@levan.com"
          dir="ltr"
          className={`w-full px-4 py-3 rounded-lg border bg-surface text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none ${
            errors.email ? "border-[#dc2626]" : "border-outline-variant"
          }`}
        />
        {errors.email && (
          <p className="text-[#dc2626] text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-body-sm font-bold text-on-surface" htmlFor="message">نص الرسالة</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          rows="5"
          placeholder="كيف يمكننا مساعدتك؟"
          className={`w-full px-4 py-3 rounded-lg border bg-surface text-on-surface focus:ring-1 focus:border-secondary transition-all outline-none resize-none ${
            errors.message ? "border-[#dc2626]" : "border-outline-variant"
          }`}
        />
        {errors.message && (
          <p className="text-[#dc2626] text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.message}
          </p>
        )}
      </div>

      {success && (
        <div className="p-4 rounded-xl flex items-center gap-3 text-sm font-medium bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a]">
          <CheckCircle size={18} />
          تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.
        </div>
      )}

      {message && !success && (
        <div className="p-4 rounded-xl flex items-center gap-3 text-sm font-medium bg-[#fef2f2] border border-[#fecaca] text-[#dc2626]">
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg hover:bg-inverse-surface transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader size={18} className="animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          <>
            <Send size={18} />
            إرسال الرسالة
          </>
        )}
      </button>
    </form>
  );
}
