"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "name", label: "الاسم" },
];

export default function CategoryContent({ products, categoryName }) {
  const [sortBy, setSortBy] = useState("newest");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => Number(a.sale_price || a.price) - Number(b.sale_price || b.price));
      case "price-desc":
        return list.sort((a, b) => Number(b.sale_price || b.price) - Number(a.sale_price || a.price));
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      default:
        return list;
    }
  }, [products, sortBy]);

  return (
    <main className="max-w-container-max mx-auto px-gutter py-section-gap min-h-screen w-full">
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-primary">{categoryName}</h1>
      </div>

      <section className="flex-1 min-w-0">
        <div className="flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-outline-variant/20 shadow-sm mb-6">
          <p className="font-body-sm text-body-sm text-on-surface-variant">{products.length} منتج</p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-body-sm text-body-sm text-on-surface bg-transparent border-none outline-none cursor-pointer appearance-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center min-h-[400px]">
            <p className="font-headline-sm text-headline-sm text-on-surface mb-1">لا توجد منتجات</p>
            <p className="text-body-sm text-on-surface-variant">لم يتم إضافة منتجات في هذا القسم بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
