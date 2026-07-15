"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { getLatestProductsAction } from "@/actions/productActions";
import ProductCard from "@/components/products/ProductCard";

export default function CategoryTabsSlider({ categories }) {
  const [activeId, setActiveId] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLatestProductsAction(activeId === "all" ? null : activeId).then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [activeId]);

  if (!categories?.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-gutter">
      <div className="text-center mb-10">
        <h2 className="font-headline-md text-headline-md text-primary">تصفح أحدث منتجاتنا</h2>
        <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveId("all")}
          className={`px-5 py-2 rounded-full font-label-caps text-label-caps transition-all duration-300 cursor-pointer ${
            activeId === "all"
              ? "bg-[#0b1c30] text-white shadow-md"
              : "bg-[#f9f9f9] text-primary border border-outline-variant/30 hover:border-secondary/50"
          }`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveId(cat.id)}
            className={`px-5 py-2 rounded-full font-label-caps text-label-caps transition-all duration-300 cursor-pointer ${
              activeId === cat.id
                ? "bg-[#0b1c30] text-white shadow-md"
              : "bg-[#f9f9f9] text-primary border border-outline-variant/30 hover:border-secondary/50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="w-8 h-8 animate-spin text-secondary" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-on-surface-variant py-16">لا توجد منتجات في هذه الفئة</p>
      ) : (
        <div className="relative group/arrows">
          <Swiper
            key={activeId}
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => { setSwiperInstance(swiper); }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="!pb-4 !px-6"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={prevRef}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-outline-variant/20 flex items-center justify-center text-primary opacity-100 md:opacity-0 md:group-hover/arrows:opacity-100 hover:bg-secondary hover:text-[#0b1c30] hover:border-secondary transition-all duration-300 disabled:opacity-0 disabled:cursor-default cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            ref={nextRef}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-outline-variant/20 flex items-center justify-center text-primary opacity-100 md:opacity-0 md:group-hover/arrows:opacity-100 hover:bg-secondary hover:text-[#0b1c30] hover:border-secondary transition-all duration-300 disabled:opacity-0 disabled:cursor-default cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
