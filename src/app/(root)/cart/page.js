"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import Link from "next/link";
import {
  Gem, ArrowLeft, Trash2, Plus, Minus, Lock, Truck, BadgeCheck,
} from "lucide-react";
import { parsePrice, formatPrice } from "@/lib/utils/price";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <main className="flex-grow w-full max-w-container-max mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-secondary/30" />

          <div className="relative mt-8 mb-10">
            <div className="absolute inset-0 rounded-full bg-secondary/5 blur-3xl scale-150" />
            <div className="relative w-28 h-28 rounded-full bg-surface-container border border-secondary/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
                <Gem size={36} className="text-secondary/60" />
              </div>
            </div>
          </div>

          <h1 className="font-headline-md text-headline-md text-on-surface text-center leading-relaxed">
            اختيارك القادم
            <br />
            لم يُصنع بعد
          </h1>

          <div className="w-8 h-px bg-secondary/30 my-6" />

          <p className="text-body-sm text-body-sm text-on-surface-variant/80 text-center max-w-xs leading-relaxed">
            سلتك فارغة اليوم — مساحة بيضاء تنتظر قطعة من الفخامة. تجول في
            مجموعاتنا ودع كل عطر يحكي لك قصته.
          </p>

          <Link
            href="/"
            className="group relative mt-10 inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-3 rounded-lg font-headline-sm text-headline-sm overflow-hidden transition-all duration-500"
          >
            <span className="relative z-10">استكشف المجموعة</span>
            <ArrowLeft size={18} className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-inverse-surface opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          <div className="flex items-center gap-3 mt-16">
            <span className="w-1 h-1 rounded-full bg-secondary/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
            <span className="w-1 h-1 rounded-full bg-secondary/20" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-section-gap">
      <div className="mb-section-gap/2 flex items-center justify-between">
        <h1 className="mb-10 text-2xl md:text-display-lg text-primary">
          سلة المشتريات
        </h1>
        <Link
          href="/"
          className="text-secondary font-headline-sm text-headline-sm flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          متابعة التسوق
          <ArrowLeft size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-section-gap items-start">
        <div className="lg:col-span-8 flex flex-col gap-stack-md">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant p-card-padding rounded-lg flex flex-col sm:flex-row gap-gutter relative group hover:shadow-sm transition-shadow duration-300"
            >
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                aria-label="Remove item"
                className="absolute top-4 left-4 text-outline hover:text-error transition-colors p-1 cursor-pointer"
              >
                <Trash2 size={20} />
              </button>

              <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-surface-container-low rounded flex items-center justify-center overflow-hidden">
                <Image alt={item.name} src={item.image} width={128} height={128} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col justify-between flex-grow py-2">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 sm:mt-0">
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
                      className="px-3 py-1 text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                    <span className="px-3 py-1 font-body-lg text-body-lg border-x border-outline-variant min-w-[40px] text-center">
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
                      className="px-3 py-1 text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                  </div>

                  <div className="text-left">
                    <p className="font-price-lg text-price-lg text-primary">
                      {formatPrice(parsePrice(item.price) * item.quantity)}
                    </p>
                    {item.oldPrice && (
                      <p className="font-price-old text-price-old text-outline line-through">
                        {formatPrice(parsePrice(item.oldPrice) * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 sticky top-28">
          <div className="bg-surface-container-lowest border border-outline-variant p-card-padding rounded-xl shadow-sm flex flex-col gap-stack-md">
            <h2 className="font-headline-md text-headline-md text-primary mb-2">
              ملخص الطلب
            </h2>

            <div className="flex justify-between items-center text-on-surface-variant font-body-lg text-body-lg pb-4 border-b border-surface-container-highest">
              <span>المجموع الفرعي ({totalItems} منتج)</span>
              <span className="font-bold text-primary">
                {formatPrice(totalAmount || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center text-on-surface-variant font-body-lg text-body-lg pb-4 border-b border-surface-container-highest">
              <span>تكلفة الشحن</span>
              <span className="text-sm">تُحسب عند الدفع</span>
            </div>

            <div className="flex justify-between items-center pt-2 mb-4">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                الإجمالي
              </span>
              <span className="font-headline-md text-headline-md font-bold text-secondary">
                {formatPrice(totalAmount || 0)}
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-outline mb-4 text-center">
              الأسعار تشمل ضريبة القيمة المضافة.
            </p>

            <Link
              href="/checkout"
              className="w-full bg-primary text-on-primary h-12 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:bg-inverse-surface transition-colors duration-300"
            >
              متابعة الدفع
              <Lock size={20} />
            </Link>

            <div className="mt-4 flex justify-center gap-4 text-on-surface-variant">
              <div className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                <Truck size={24} />
                <span className="font-body-sm text-body-sm text-[10px]">
                  شحن سريع
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                <BadgeCheck size={24} />
                <span className="font-body-sm text-body-sm text-[10px]">
                  دفع آمن
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
