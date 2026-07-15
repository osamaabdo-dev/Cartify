"use client";

import { APP_CONFIG } from "@/lib/constants";
import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/authActions";
import { User, Mail, Lock } from "lucide-react";

const INITIAL_STATE = { success: false, errors: {} };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    INITIAL_STATE,
  );

  return (
    <main className="flex-1 flex items-center justify-center p-10 relative">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #fed488 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-md bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#c6c6cd]/30 p-8 relative z-10">
        <div className="text-center mb-8">
          <span
            className="inline-block text-3xl font-bold text-[#775a19] mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            {APP_CONFIG.siteName}
          </span>
          <h1 className="text-2xl font-bold text-[#0b1c30] mb-1">
            إنشاء حساب جديد
          </h1>
          <p className="text-[#45464d] text-sm">
            انضم إلى عالم الهدايا الفاخرة
          </p>
        </div>

        {state?.message && !state.success && (
          <div className="mb-5 p-3 rounded bg-[#ffdad6] text-[#93000a] text-sm font-medium">
            {state.message}
          </div>
        )}

        {state?.success ? (
          <div className="mb-5 p-4 rounded bg-emerald-50 text-emerald-700 text-sm font-medium text-center leading-relaxed">
            تم إنشاء الحساب بنجاح! يمكنك الآن{" "}
            <Link href="/login" className="underline font-bold">
              تسجيل الدخول
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium text-[#0b1c30] mb-1"
                htmlFor="name"
              >
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#45464d]">
                  <User size={20} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="الاسم الكامل"
                  disabled={isPending}
                  className="block w-full pr-10 pl-3 py-3 border border-[#c6c6cd] rounded bg-[#f8f9ff] text-[#0b1c30] focus:ring-1 focus:ring-[#775a19] focus:border-[#775a19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {state?.errors?.name && (
                <p className="mt-1.5 text-sm text-[#ba1a1a]">
                  {state.errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#0b1c30] mb-1"
                htmlFor="email"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#45464d]">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  dir="ltr"
                  disabled={isPending}
                  className="block w-full pr-10 pl-3 py-3 border border-[#c6c6cd] rounded bg-[#f8f9ff] text-[#0b1c30] focus:ring-1 focus:ring-[#775a19] focus:border-[#775a19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1.5 text-sm text-[#ba1a1a]">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#0b1c30] mb-1"
                htmlFor="password"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#45464d]">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  dir="ltr"
                  disabled={isPending}
                  className="block w-full pr-10 pl-3 py-3 border border-[#c6c6cd] rounded bg-[#f8f9ff] text-[#0b1c30] focus:ring-1 focus:ring-[#775a19] focus:border-[#775a19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {state?.errors?.password && (
                <p className="mt-1.5 text-sm text-[#ba1a1a]">
                  {state.errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#0b1c30] mb-1"
                htmlFor="confirmPassword"
              >
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#45464d]">
                  <Lock size={20} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  dir="ltr"
                  disabled={isPending}
                  className="block w-full pr-10 pl-3 py-3 border border-[#c6c6cd] rounded bg-[#f8f9ff] text-[#0b1c30] focus:ring-1 focus:ring-[#775a19] focus:border-[#775a19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {state?.errors?.confirmPassword && (
                <p className="mt-1.5 text-sm text-[#ba1a1a]">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>

            <button type="submit" disabled={isPending}
              className="bg-primary text-white hover:bg-inverse-surface active:scale-[0.98] transition-all cursor-pointer font-medium rounded-md py-3 px-6 w-full shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  جاري إنشاء الحساب...
                </span>
              ) : (
                "إنشاء حساب"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#c6c6cd]/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[#45464d]">أو</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#45464d]">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-medium text-[#775a19] hover:text-[#e9c176] transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
