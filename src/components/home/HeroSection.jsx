"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[400px] md:h-[500px] bg-primary flex items-center justify-center relative overflow-hidden py-12 md:py-0">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-gutter text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-secondary px-5 py-2 rounded-full text-body-sm font-medium mb-8 backdrop-blur-sm border border-white/10">
          <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
          تشكيلة ربيع 2026
        </div>

        <h1 className="font-display text-3xl md:text-display-lg text-white font-bold leading-tight mb-5">
          عبير واحد
          <br />
          <span className="text-secondary relative">
            يصنع لك حضوراً
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-secondary/40 rounded-full hidden md:block" />
          </span>{" "}
          خاص
        </h1>

        <p className="text-body-lg text-white/60 mb-10 leading-relaxed max-w-lg mx-auto">
          اكتشف مجموعتنا الحصرية من أفخم العطور الشرقية والغربية التي تمنحك حضوراً لا يُنسى
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-[#0b1c30] px-8 py-3.5 rounded-xl font-bold text-body-sm hover:bg-secondary/90 transition-all duration-300  shadow-secondary/25 active:scale-[0.97] min-h-[44px] w-full md:w-auto"
          >
            تسوق الآن
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-body-sm text-white/70 border border-white/20 hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-300 min-h-[44px] w-full md:w-auto"
          >
            اكتشف المزيد
          </Link>
        </div>
      </div>
    </section>
  );
}
