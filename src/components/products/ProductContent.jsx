"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { addToCart, setCartOpen } from "@/store/slices/cartSlice";
import { formatCurrency } from "@/lib/utils/dashboardUtils";
import QuantitySelector from "./QuantitySelector";
import ProductCard from "./ProductCard";

export default function ProductContent({ product, relatedProducts }) {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  const mainImage = product.images?.[0] || "/placeholder.png";
  const salePercent =
    product.sale_price && Number(product.price) > 0
      ? Math.round((1 - Number(product.sale_price) / Number(product.price)) * 100)
      : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: Number(product.sale_price || product.price),
          image: mainImage,
          slug: product.slug,
          stock: product.stock,
        })
      );
    }
    dispatch(setCartOpen(true));
  };

  return (
    <main className="min-h-screen">
      <section className="max-w-container-max mx-auto px-gutter py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative w-full aspect-[4/5] bg-white rounded-[2rem] border border-outline-variant/20 overflow-hidden flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            {salePercent && (
              <div className="absolute top-4 right-4 bg-error text-on-error font-label-caps text-[14px] px-2.5 py-1 rounded-sm z-10">
                -{salePercent}%
              </div>
            )}
            <Image alt={product.name} src={mainImage} fill className="object-contain p-4 md:p-8 mix-blend-multiply" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              {product.category?.slug ? (
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.1em] hover:text-[#634a14] transition-colors"
                >
                  {product.category.name}
                </Link>
              ) : (
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.1em]">
                  {product.category?.name || "Perfumes"}
                </span>
              )}
              <h1 className="text-2xl md:text-display-lg text-primary mt-2 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="font-price-lg text-price-lg text-primary">
                  {formatCurrency(Number(product.sale_price || product.price))}
                </span>
                {product.sale_price && (
                  <span className="font-price-old text-price-old text-on-surface-variant line-through">
                    {formatCurrency(Number(product.price))}
                  </span>
                )}
              </div>
              {salePercent && (
                <span className="inline-block mt-2 font-label-caps text-label-caps bg-error text-on-error px-2 py-1 rounded">
                  -{salePercent}%
                </span>
              )}
            </div>

            {product.description && (
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <QuantitySelector stock={product.stock} onChange={setQty} />
              <button onClick={handleAdd} disabled={product.stock === 0}
                className="w-full sm:flex-1 h-[56px] bg-primary text-white font-headline-sm text-headline-sm rounded-xl hover:bg-inverse-surface transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {product.stock === 0 ? "نفد من المخزون" : "أضف للسلة"}
              </button>
            </div>


          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-section-gap ">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-12">
              <h2 className="font-display-lg text-display-lg text-primary">عطور قد تعجبك</h2>
              <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}


