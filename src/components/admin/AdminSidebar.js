"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/lib/constants";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, MessageSquareText, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "/admin", Icon: LayoutDashboard },
  { label: "المنتجات", href: "/admin/products", Icon: Package },
  { label: "الأقسام", href: "/admin/categories", Icon: Tags },
  { label: "الطلبات", href: "/admin/orders", Icon: ShoppingCart },
  { label: "طلبات التواصل", href: "/admin/contact-messages", Icon: MessageSquareText },
  { label: "الأعضاء", href: "/admin/users", Icon: Users },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:sticky top-0 right-0 h-full w-72 z-50 flex flex-col text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        } sidebar-gradient`}
      >
        <div className="h-24 flex items-center px-8 border-b border-white/10 shrink-0">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#ffdea5]">
            {APP_CONFIG.siteName}
          </h2>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#fed488] text-[#785a1a] font-bold shadow-lg shadow-[#775a19]/20"
                    : "text-[#7c839b] hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.Icon size={22} className={isActive ? "fill-current" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-4 px-4 py-3 w-full rounded-lg bg-[#fed488] text-[#261900] font-bold hover:brightness-90 transition-all cursor-pointer"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
