"use client";

import dynamic from "next/dynamic";

const ProductSlider = dynamic(() => import("@/components/home/ProductSlider"), { ssr: false });
const CategoryTabsSlider = dynamic(() => import("@/components/home/CategoryTabsSlider"), { ssr: false });

export default function HomeSliders({ featuredProducts, onSaleProducts, categories }) {
  return (
    <>
      {featuredProducts.length > 0 && (
        <section className="bg-[#f4f7ff] py-section-gap">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-12">
              <h2 className="font-headline-md text-headline-md text-primary">أفضل المنتجات</h2>
              <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
            </div>
            <ProductSlider products={featuredProducts} />
          </div>
        </section>
      )}

      {onSaleProducts.length > 0 && (
        <section className="py-section-gap">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-12">
              <h2 className="font-headline-md text-headline-md text-primary">أفضل الخصومات</h2>
              <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
            </div>
            <ProductSlider products={onSaleProducts} />
          </div>
        </section>
      )}

      <section className="bg-white py-section-gap">
        <CategoryTabsSlider categories={categories} />
      </section>
    </>
  );
}