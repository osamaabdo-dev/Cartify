"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import { useActionState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { useSession } from "next-auth/react";
import { APP_CONFIG, COUNTRIES } from "@/lib/constants";
import { createOrder } from "@/actions/orderActions";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, itemTotal } from "@/lib/utils/price";
import {
  CheckCircle, ArrowLeft, ShoppingCart, Lock, Truck, CreditCard,
  DollarSign, Hourglass, ShieldCheck,
} from "lucide-react";

const INPUT_CLASS =
  "w-full rounded px-4 py-3 font-body-lg border border-outline-variant focus:border-primary focus:outline-none transition-colors";

const SHIPPING_COST = 3;
const INITIAL_STATE = { success: false, errors: {} };

const EMPTY = {
  customerName: "", customerEmail: "", phone: "",
  address: "", city: "", district: "", country: "الأردن",
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { items } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [state, formAction, isPending] = useActionState(createOrder, INITIAL_STATE);
  const [values, setValues] = useState(EMPTY);
  const cartCleared = useRef(false);

  useEffect(() => {
    if (state.success && !cartCleared.current) {
      cartCleared.current = true;
      dispatch(clearCart());
    }
  }, [state.success, dispatch]);

  useEffect(() => {
    if (state.success) {
      setValues(EMPTY);
    }
  }, [state.success]);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.set(key, val));
    formData.set("paymentMethod", paymentMethod);
    formData.set("cartItems", JSON.stringify(items));
    formData.set("userId", session?.user?.id || "");
    startTransition(() => formAction(formData));
  };

  const subtotal = items.reduce((sum, item) => sum + itemTotal(item), 0);
  const total = subtotal + SHIPPING_COST;

  if (state.success) {
    return (
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-section-gap">
        <div className="max-w-lg mx-auto text-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 rounded-full bg-secondary/5 blur-3xl scale-150" />
            <div className="relative w-28 h-28 rounded-full bg-surface-container border border-secondary/10 flex items-center justify-center mx-auto">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
                <CheckCircle size={48} className="text-secondary" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-display-lg text-primary mb-4">
            تم استلام طلبك بنجاح!
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-2">
            شكراً لك على طلبك. سنقوم بتأكيد الطلب قريباً والتواصل معك بخصوص التوصيل.
          </p>
          <p className="font-body-sm text-on-surface-variant mb-8">
            رقم الطلب: <span className="font-bold text-primary" dir="ltr">{state.orderNumber}</span>
          </p>

          <div className="w-8 h-px bg-secondary/30 mx-auto mb-8" />

          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-3 rounded-lg font-headline-sm text-headline-sm overflow-hidden transition-all duration-500"
          >
            <span className="relative z-10">العودة إلى المتجر</span>
            <ArrowLeft size={18} className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-inverse-surface opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-section-gap">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 rounded-full bg-secondary/5 blur-3xl scale-150" />
            <div className="relative w-28 h-28 rounded-full bg-surface-container border border-secondary/10 flex items-center justify-center mx-auto">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
                <ShoppingCart size={36} className="text-secondary/60" />
              </div>
            </div>
          </div>

          <h1 className="font-headline-md text-headline-md text-primary mb-4">
            سلتك فارغة
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-8">
            أضف بعض المنتجات إلى سلتك قبل إتمام الطلب.
          </p>

          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-3 rounded-lg font-headline-sm text-headline-sm overflow-hidden transition-all duration-500"
          >
            <span className="relative z-10">تصفح المنتجات</span>
            <ArrowLeft size={18} className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-inverse-surface opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant py-4">
        <div className="max-w-container-max mx-auto px-gutter flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <Lock size={20} />
            <span className="font-body-sm text-on-surface-variant">دفع آمن وموثوق</span>
          </div>
          <Link href="/" className="font-headline-md text-headline-md font-bold text-secondary">
            {APP_CONFIG.siteName}
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-section-gap">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-display-lg text-primary mb-2">إتمام الطلب</h1>
          <p className="font-body-lg text-on-surface-variant">الرجاء إدخال تفاصيل الشحن والدفع لإتمام عملية الشراء.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" noValidate>
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
                <Truck size={20} className="text-primary bg-surface-container-low p-2 rounded-full" />
                <h2 className="font-headline-sm text-headline-sm text-primary">تفاصيل الشحن</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="md:col-span-2">
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="customerName">الاسم الكامل</label>
                  <input
                    className={INPUT_CLASS}
                    id="customerName"
                    name="customerName"
                    placeholder="أدخل اسمك الكامل"
                    type="text"
                    value={values.customerName}
                    onChange={handleChange}
                  />
                  {state.errors?.customerName && (
                    <p className="text-error font-body-sm mt-1">{state.errors.customerName}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="customerEmail">البريد الإلكتروني</label>
                  <input
                    className={`${INPUT_CLASS} text-left dir-ltr`}
                    id="customerEmail"
                    name="customerEmail"
                    placeholder="example@email.com"
                    type="email"
                    value={values.customerEmail}
                    onChange={handleChange}
                  />
                  {state.errors?.customerEmail && (
                    <p className="text-error font-body-sm mt-1">{state.errors.customerEmail}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="phone">رقم الهاتف</label>
                  <input
                    className={`${INPUT_CLASS} text-left dir-ltr`}
                    id="phone"
                    name="phone"
                    placeholder="+962 7X XXX XXXX"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                  />
                  {state.errors?.phone && (
                    <p className="text-error font-body-sm mt-1">{state.errors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="address">العنوان التفصيلي</label>
                  <input
                    className={INPUT_CLASS}
                    id="address"
                    name="address"
                    placeholder="اسم الشارع, المبنى, رقم الشقة"
                    type="text"
                    value={values.address}
                    onChange={handleChange}
                  />
                  {state.errors?.address && (
                    <p className="text-error font-body-sm mt-1">{state.errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="country">الدولة</label>
                  <select
                    id="country"
                    name="country"
                    className={INPUT_CLASS}
                    value={values.country}
                    onChange={handleChange}
                  >
                    <option disabled value="">اختر الدولة</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="city">المدينة</label>
                  <input
                    className={INPUT_CLASS}
                    id="city"
                    name="city"
                    placeholder="أدخل اسم المدينة"
                    type="text"
                    value={values.city}
                    onChange={handleChange}
                  />
                  {state.errors?.city && (
                    <p className="text-error font-body-sm mt-1">{state.errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block font-body-sm text-on-surface-variant mb-2" htmlFor="district">المنطقة / الحي</label>
                  <input
                    className={INPUT_CLASS}
                    id="district"
                    name="district"
                    placeholder="أدخل اسم المنطقة"
                    type="text"
                    value={values.district}
                    onChange={handleChange}
                  />
                  {state.errors?.district && (
                    <p className="text-error font-body-sm mt-1">{state.errors.district}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
                <CreditCard size={20} className="text-primary bg-surface-container-low p-2 rounded-full" />
                <h2 className="font-headline-sm text-headline-sm text-primary">طريقة الدفع</h2>
              </div>
              <div className="space-y-4">
                <label className="relative block cursor-pointer">
                  <input
                    className="payment-radio sr-only"
                    name="paymentMethod"
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="border border-outline-variant rounded-lg p-4 flex items-center justify-between transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border border-outline-variant flex items-center justify-center flex-shrink-0 bg-surface-container-lowest">
                        <div className="radio-inner w-2.5 h-2.5 rounded-full transform scale-0 transition-transform duration-200" />
                      </div>
                      <div>
                        <span className="font-body-lg text-primary block">الدفع عند الاستلام</span>
                        <span className="font-body-sm text-on-surface-variant">قد تطبق رسوم إضافية</span>
                      </div>
                    </div>
                    <DollarSign size={20} className="text-outline" />
                  </div>
                </label>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 relative">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 sticky top-24">
              <h2 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant pb-4">ملخص الطلب</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-outline-variant pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-surface rounded-md border border-outline-variant overflow-hidden flex-shrink-0">
                      <Image alt={item.name} src={item.image} width={80} height={80} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-body-lg text-primary line-clamp-1">{item.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-body-sm text-on-surface-variant">الكمية: {item.quantity}</span>
                        <span className="font-price-lg text-price-lg text-primary">{formatPrice(itemTotal(item))}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-body-lg text-on-surface-variant">المجموع الفرعي</span>
                  <span className="font-body-lg text-primary">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-lg text-on-surface-variant">رسوم التوصيل</span>
                  <span className="font-body-lg text-primary">{formatPrice(SHIPPING_COST)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant mb-8">
                <span className="font-headline-sm text-headline-sm text-primary">المجموع الكلي</span>
                <span className="font-headline-md text-headline-md text-primary">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-on-primary h-12 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:bg-inverse-surface transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Hourglass size={20} className="animate-spin" />
                    <span>جاري المعالجة...</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد الطلب</span>
                    <CheckCircle size={20} />
                  </>
                )}
              </button>

              {state.message && (
                <p className="text-center font-body-sm text-error mt-4">{state.message}</p>
              )}

              <p className="text-center font-body-sm text-on-surface-variant mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={16} />
                عملية دفع آمنة ومشفرة
              </p>
            </div>
          </div>
        </form>
      </main>

      <footer className="w-full py-section-gap mt-auto bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-tertiary-container font-body-sm text-body-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
          <div className="space-y-4">
            <span className="font-headline-sm text-headline-sm text-secondary block">{APP_CONFIG.siteName}</span>
            <p className="opacity-80">© 2024 {APP_CONFIG.siteName}. جميع الحقوق محفوظة. إهداء فاخر بدقة.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors" href="#">سياسة الخصوصية</Link>
            <Link className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors" href="#">شروط الخدمة</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors" href="#">معلومات الشحن</Link>
            <Link className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors" href="#">دعم العملاء</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors" href="#">متاجرنا</Link>
          </div>
        </div>
      </footer>

    </>
  );
}
