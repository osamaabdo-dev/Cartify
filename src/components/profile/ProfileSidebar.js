"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/lib/constants";
import { signOut } from "next-auth/react";
import { LayoutDashboard, ListOrdered, ArrowLeft, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "/profile", Icon: LayoutDashboard },
  { label: "طلباتي", href: "/profile/orders", Icon: ListOrdered },
];

export default function ProfileSidebar({ onNavClick }) {
  const pathname = usePathname();

  return (
    <aside className="h-full w-72 flex flex-col text-white shrink-0 sidebar-gradient">
      <div className="h-24 flex items-center px-8 border-b border-white/10 shrink-0">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#ffdea5]">
          {APP_CONFIG.siteName}
        </h2>
      </div>

      <div className="px-8 py-4 border-b border-white/5 shrink-0">
        <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">الملف الشخصي</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/profile"
              ? pathname === "/profile"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
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

      <div className="px-4 py-3 border-t border-white/5 shrink-0">
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center justify-center gap-4 px-4 py-3 w-full rounded-lg bg-white/5 text-[#7c839b] hover:text-white hover:bg-white/10 transition-all font-bold text-sm"
        >
          <ArrowLeft size={18} />
          <span>العودة للمتجر</span>
        </Link>
      </div>

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
  );
}
