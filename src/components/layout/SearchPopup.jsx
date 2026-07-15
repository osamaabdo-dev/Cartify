"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader, Package } from "lucide-react";
import Image from "next/image";
import { getStoreProductsAction } from "@/actions/productActions";
import { formatCurrency } from "@/lib/utils/dashboardUtils";

export default function SearchPopup({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await getStoreProductsAction({ search: value });
      setResults(data);
      setLoading(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container-lowest w-full max-w-xl mx-4 rounded-2xl shadow-2xl border border-outline-variant overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-outline-variant">
          <Search size={20} className="text-on-surface-variant shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="ابحث عن منتج..."
            className="flex-1 bg-transparent border-none outline-none text-body-lg text-on-surface placeholder:text-on-surface-variant"
          />
          {loading && <Loader size={18} className="animate-spin text-secondary shrink-0" />}
          <button onClick={onClose} className="p-1 hover:text-secondary transition-colors cursor-pointer shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.trim() && !loading && results.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-container-low flex items-center justify-center">
                <Package size={28} className="text-on-surface-variant" />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface mb-1">لا توجد نتائج</p>
              <p className="text-body-sm text-on-surface-variant">لم نجد منتجات تطابق بحثك</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/50">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-surface-container-low transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={20} className="text-on-surface-variant" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-sm text-body-sm font-bold text-on-surface truncate group-hover:text-secondary transition-colors">
                      {product.name}
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      {formatCurrency(product.sale_price ?? product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
