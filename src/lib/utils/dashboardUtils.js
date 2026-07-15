import { APP_CONFIG } from "@/lib/constants";

export const n = (v) => Number(v).toLocaleString("en-US");

export const formatCurrency = (amount) =>
  n(amount) + " " + APP_CONFIG.currency;

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;
  return new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "short", day: "numeric" }).format(new Date(date));
};

export const statusMap = {
  PENDING: { label: "قيد الانتظار", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  PROCESSING: { label: "قيد المعالجة", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  SHIPPED: { label: "قيد التوصيل", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  DELIVERED: { label: "مكتمل", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  CANCELLED: { label: "ملغى", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
};

export const roleStyles = {
  ADMIN: "bg-amber-50 text-amber-700 border border-amber-200",
  USER: "bg-blue-50 text-blue-700 border border-blue-200",
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
