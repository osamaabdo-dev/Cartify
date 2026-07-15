export function formatPrice(price) {
  return `${Number(price).toLocaleString("en-US")} ر.س`;
}

export function slugify(text) {
  return text
    .toString()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0660-\u0669-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function getStockInfo(stock) {
  if (stock === 0) return { label: "نفد المخزون", dot: "bg-[#dc2626]", badge: "bg-[#fef2f2] text-[#b91c1c]" };
  if (stock <= 5) return { label: "مخزون منخفض", dot: "bg-[#d97706]", badge: "bg-[#fffbeb] text-[#92400e]" };
  return { label: "متوفر", dot: "bg-[#16a34a]", badge: "bg-[#f0fdf4] text-[#166534]" };
}

export function getStockOptions() {
  return [
    { value: "الكل", label: "جميع الحالات" },
    { value: "متوفر", label: "متوفر" },
    { value: "مخزون منخفض", label: "مخزون منخفض" },
    { value: "نفد المخزون", label: "نفد المخزون" },
  ];
}

export function getMetrics(products) {
  return {
    total: products.length,
    inStock: products.filter((p) => p.stock > 5).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    categories: [...new Set(products.map((p) => p.category))].length,
  };
}

export function filterProducts(products, { searchQuery, categoryFilter, statusFilter }) {
  const q = searchQuery.trim().toLowerCase();
  return products.filter((p) => {
    const matchesSearch =
      !q || p.name.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "الكل" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "الكل" || getStockInfo(p.stock).label === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

export function paginateItems(items, page, perPage) {
  const totalPages = Math.ceil(items.length / perPage);
  const paginatedItems = items.slice((page - 1) * perPage, page * perPage);
  return { paginatedItems, totalPages };
}

import { Package, CheckCircle, XCircle, Grid3X3 } from "lucide-react";

export const metricCards = [
  { key: "total", label: "إجمالي المنتجات", Icon: Package, bg: "bg-[#f0fdf4]", iconColor: "text-[#16a34a]" },
  { key: "inStock", label: "متوفرة حالياً", Icon: CheckCircle, bg: "bg-[#f0fdf4]", iconColor: "text-[#16a34a]" },
  { key: "outOfStock", label: "غير متوفرة", Icon: XCircle, bg: "bg-[#fef2f2]", iconColor: "text-[#dc2626]" },
  { key: "categories", label: "التصنيفات النشطة", Icon: Grid3X3, bg: "bg-[#fffbeb]", iconColor: "text-[#d97706]" },
];
