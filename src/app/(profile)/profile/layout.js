"use client";

import { useState } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import "@/app/(admin)/admin/admin.css";

export default function ProfileLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ProfileSidebar onNavClick={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8f9ff]">
        <ProfileHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
