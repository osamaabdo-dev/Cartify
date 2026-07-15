"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, ChevronDown, Loader, ArrowUpDown } from "lucide-react";
import { getStoreProductsAction } from "@/actions/productActions";
import ProductCard from "@/components/products/ProductCard";

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "price-asc", label: "السعر: الأقل أولاً" },
  { value: "price-desc", label: "السعر: الأعلى أولاً" },
  { value: "name", label: "الاسم" },
];

export default function StoreContent({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const data = await getStoreProductsAction({
        search,
        categoryId: activeCategory,
      });
      setProducts(data);
      setLoading(false);
    }, 300);
  }, [search, activeCategory]);

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
    <div className="max-w-container-max mx-auto px-gutter py-section-gap min-h-screen w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {loading && <Loader className="w-4 h-4 animate-spin text-secondary" />}
        </div>
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-outline-variant/30 rounded-xl text-body-sm font-medium text-primary hover:bg-surface-container transition-colors cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
          تصفية
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`${mobileFilterOpen ? "block" : "hidden"} lg:block w-full lg:w-72 flex-shrink-0`}>
          <div className="lg:sticky lg:top-32 space-y-6 bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full h-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl pr-12 pl-4 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-3">التصنيفات</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveCategory(null); setMobileFilterOpen(false); }}
                  className={`w-full text-right px-4 py-2.5 rounded-xl font-body-sm text-body-sm transition-all duration-200 cursor-pointer ${
                    activeCategory === null
                      ? "bg-primary text-white shadow-sm"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  الكل
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setMobileFilterOpen(false); }}
                    className={`w-full text-right px-4 py-2.5 rounded-xl font-body-sm text-body-sm transition-all duration-200 cursor-pointer ${
                      activeCategory === cat.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 min-w-0">
          <div className="flex items-center justify-between bg-white rounded-xl px-5 py-3 border border-outline-variant/20 shadow-sm mb-6">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {products.length} منتج
            </p>
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
          <div className="relative">
            {loading && products.length > 0 && (
              <div className="absolute inset-0 bg-surface/50 z-10 rounded-2xl" />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              {products.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-on-surface-variant" />
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-surface mb-1">لا توجد منتجات</p>
                  <p className="text-body-sm text-on-surface-variant">
                    {search ? "حاول تعديل مصطلح البحث" : "لم يتم إضافة منتجات بعد"}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl font-body-sm text-body-sm hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      عرض الكل
                    </button>
                  )}
                </div>
              ) : (
                sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
