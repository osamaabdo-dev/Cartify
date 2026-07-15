"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { APP_CONFIG } from "@/lib/constants";
import { parsePrice } from "@/lib/utils/price";
import Image from "next/image";
import {
  ShoppingBag,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const totalPrice = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed top-0 left-0 z-[70] h-full w-full max-w-md bg-surface shadow-2xl flex flex-col animate-slide-in-left">
        <div className="flex items-center justify-between px-gutter py-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              سلة المشتريات
            </h2>
            <span className="bg-primary text-on-primary text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center leading-none">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-gutter py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-outline-variant" />
              </div>
              <div>
                <p className="font-body-lg text-body-lg text-on-surface mb-1">
                  السلة فارغة حالياً
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  أضف بعض المنتجات الرائعة لتبدأ
                </p>
              </div>
              <Link
                href="/"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-primary text-on-primary h-11 px-6 rounded-lg font-headline-sm text-headline-sm hover:opacity-90 transition-all duration-300 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-3 relative group"
                >
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="absolute top-2 left-2 text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>

                  <div className="w-20 h-20 flex-shrink-0 bg-surface-container-low rounded overflow-hidden">
                    <Image alt={item.name} src={item.image} width={80} height={80} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <h3 className="font-body-sm text-body-sm text-on-surface truncate">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-container-lowest">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="px-2 py-0.5 text-primary hover:bg-surface-container-low transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="px-2 py-0.5 font-body-sm text-body-sm border-x border-outline-variant min-w-[28px] text-center leading-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              dispatch(removeFromCart(item.id));
                            } else {
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                })
                              );
                            }
                          }}
                          className="px-2 py-0.5 text-primary hover:bg-surface-container-low transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="font-price-lg text-price-lg text-primary whitespace-nowrap">
                        {parsePrice(item.price) * item.quantity}{" "}
                        {APP_CONFIG.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-outline-variant px-gutter py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body-lg text-body-lg text-on-surface-variant">
                المجموع
              </span>
              <span className="font-headline-md text-headline-md text-secondary">
                {totalPrice} {APP_CONFIG.currency}
              </span>
            </div>

            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="bg-white hover:bg-inverse-surface hover:text-white flex-1 flex items-center justify-center gap-2 bg-surface-container-high text-on-surface h-12 rounded-lg font-headline-sm   transition-colors duration-300">
                <ShoppingCart className="w-4 h-4" />
                عرض السلة
              </Link>
              <Link href="/checkout" onClick={onClose} className="hover:bg-inverse-surface hover:text-white flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary h-12 rounded-lg font-headline-sm  hover:opacity-90 transition-opacity duration-300">
                إتمم الطلب
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
