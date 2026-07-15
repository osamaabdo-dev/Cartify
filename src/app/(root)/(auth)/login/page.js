"use client";

import { APP_CONFIG } from "@/lib/constants";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginActionHelper } from "@/lib/client-auth";
import { getSession } from "next-auth/react";
import { Gift, Mail, Lock } from "lucide-react";

const INITIAL_STATE = { success: false, errors: {} };

export default function LoginPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => await loginActionHelper(formData),
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.success) {
      getSession().then((session) => {
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      });
    }
  }, [state.success, router]);

  return (
    <main className="flex-1 flex items-center justify-center p-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-surface-dim opacity-40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[800px] h-[800px] rounded-full bg-surface-container opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-outline-variant/40 p-8 sm:p-12 flex flex-col gap-10">
        <header className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-surface text-secondary flex items-center justify-center mb-1 border border-outline-variant/30 shadow-sm">
            <Gift size={28} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-headline tracking-tight">
            تسجيل الدخول
          </h1>
          <p className="text-on-surface-variant text-sm font-body leading-relaxed">
            مرحباً بك مجدداً في{" "}
            <span className="font-bold text-primary">{APP_CONFIG.siteName}</span>.
            <br />
            يرجى إدخال بياناتك للمتابعة.
          </p>
        </header>

        {state?.message && !state.success && (
          <div className="p-3 rounded bg-error-container text-on-error-container text-sm font-medium -mt-6">
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-bold text-on-surface font-label"
              htmlFor="email"
            >
              البريد الإلكتروني
            </label>
            <div className="relative flex items-center">
              <Mail size={20} className="absolute right-4 text-outline pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                disabled={isPending}
                className="w-full bg-surface rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all py-3.5 pr-11 pl-4 text-on-surface font-body text-left placeholder:text-outline-variant/70 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {state?.errors?.email && (
              <p className="text-sm text-error">{state.errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-bold text-on-surface font-label"
                htmlFor="password"
              >
                كلمة المرور
              </label>
              <span className="text-xs font-bold text-secondary hover:text-primary transition-colors font-body cursor-pointer">
                نسيت كلمة المرور؟
              </span>
            </div>
            <div className="relative flex items-center">
              <Lock size={20} className="absolute right-4 text-outline pointer-events-none" />
              <input
                id="password"
                name="password"
                type="password"
                dir="ltr"
                placeholder="••••••••"
                disabled={isPending}
                className="w-full bg-surface rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all py-3.5 pr-11 pl-4 text-on-surface font-body text-left placeholder:text-outline-variant/70 tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {state?.errors?.password && (
              <p className="text-sm text-error">{state.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
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
                    d="M4 12a8 8 0 018-8V0C5.393 0 0 5.373 0 12h4z"
                  />
                </svg>
                جاري تسجيل الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        <footer className="pt-6 border-t border-outline-variant/20 text-center">
          <p className="text-sm text-on-surface-variant font-body">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:text-secondary transition-colors underline decoration-outline-variant/50 underline-offset-4"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
