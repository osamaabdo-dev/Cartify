"use client";

import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { addToCart, setCartOpen } from "@/store/slices/cartSlice";
import { formatCurrency } from "@/lib/utils/dashboardUtils";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const image = product.images?.[0] || "/placeholder.png";
  const salePercent =
    product.sale_price && Number(product.price) > 0
      ? Math.round((1 - Number(product.sale_price) / Number(product.price)) * 100)
      : null;
  const displayPrice = Number(product.sale_price || product.price);

  return (
    <div className="group bg-white border border-outline-variant/20 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square p-6 flex justify-center items-center bg-surface">
        {salePercent && (
          <div className="absolute top-4 right-4 bg-error text-on-error font-label-caps text-[14px] px-2 py-1 rounded-sm z-10">
            -{salePercent}%
          </div>
        )}
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image alt={product.name} src={image} fill className="object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
        </Link>
      </div>
      <div className="p-card-padding text-center">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-headline-sm font-bold text-primary mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="font-price-lg text-price-lg text-primary">
            {formatCurrency(displayPrice)}
          </span>
          {product.sale_price && (
            <span className="font-price-old text-price-old text-on-surface-variant line-through">
              {formatCurrency(Number(product.price))}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            dispatch(addToCart({
              id: product.id,
              name: product.name,
              price: displayPrice,
              image,
              slug: product.slug,
              stock: product.stock,
            }));
            dispatch(setCartOpen(true));
          }}
          className="w-full py-3 bg-primary text-white font-bold text-body-sm rounded-xl hover:bg-inverse-surface transition-all duration-300 active:scale-95 cursor-pointer"
        >
          أضف للسلة
        </button>
      </div>
    </div>
  );
}
