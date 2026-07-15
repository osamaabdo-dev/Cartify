"use client";

import Link from "next/link";
import Image from "next/image";

const PLACEHOLDER = "/placeholder.png";

export default function CategoriesSection({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-gutter">
      <div className="text-center mb-12">
        <h2 className="font-headline-md text-headline-md text-primary">تسوق حسب الفئة</h2>
        <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.slug ? `/categories/${cat.slug}` : "/products"}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px]"
          >
            <div className="aspect-square overflow-hidden relative">
              <Image alt={cat.name} src={cat.image || PLACEHOLDER} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/70 via-[#0b1c30]/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                <h3 className="font-headline-sm text-headline-sm text-white">{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
