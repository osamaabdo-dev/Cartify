"use client";

import { ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

export default function AdminHeader({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e2e8f0] px-4 md:px-6 h-16 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          aria-label="فتح القائمة"
        >
          <Menu size={20} className="text-[#0b1c30]" />
        </button>
        <span className="text-sm text-[#94a3b8]">لوحة التحكم</span>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#775a19] text-white text-sm font-bold hover:bg-[#634a14] transition-all"
        >
          <ExternalLink size={16} />
          الموقع
        </Link>
      </div>
    </header>
  );
}
