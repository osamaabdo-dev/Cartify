"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import { LayoutDashboard, ShoppingBag, Search, ShoppingCart, LogOut, User, Menu, X } from "lucide-react";
import { setCartOpen } from "@/store/slices/cartSlice";
import CartSidebar from "@/components/cart/CartSidebar";
import SearchPopup from "@/components/layout/SearchPopup";

export default function Navbar() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const items = useSelector((state) => state.cart.items);
  const isCartOpen = useSelector((state) => state.cart.cartOpen);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-primary-container dark:bg-primary-container text-white dark:text-white sticky top-0 z-50 shadow-sm dark:shadow-none ">
        <div className="flex justify-between items-center h-20 px-gutter w-full max-w-container-max mx-auto">
          <Link
            href="/"
            className="font-headline-md text-headline-md font-bold flex items-center gap-2 cursor-pointer hover:text-secondary transition-colors duration-300"
          >
            <ShoppingBag size={24} fill="currentColor" />
            {APP_CONFIG.siteName}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-secondary transition-colors duration-300 font-body-lg text-body-lg cursor-pointer"
            >
              الرئيسية
            </Link>
            <Link
              href="/products"
              className="hover:text-secondary transition-colors duration-300 font-body-lg text-body-lg cursor-pointer"
            >
              المتجر
            </Link>
            <Link
              href="/categories"
              className="hover:text-secondary transition-colors duration-300 font-body-lg text-body-lg cursor-pointer"
            >
              الأقسام
            </Link>
            <Link
              href="/contact"
              className="hover:text-secondary transition-colors duration-300 font-body-lg text-body-lg cursor-pointer"
            >
              تواصل معنا
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden hover:text-secondary transition-colors duration-300 cursor-pointer"
              aria-label="فتح القائمة"
            >
              <Menu size={24} />
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform cursor-pointer mx-2 md:mx-0"
            >
              <Search size={22} />
            </button>

            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform cursor-pointer ml-4 md:ml-0"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-2 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full" suppressHydrationWarning>
                {items.length}
              </span>
            </button>

            {session ? (
              <>
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/profile"}
                  className="md:hidden hover:text-secondary transition-colors duration-300 cursor-pointer"
                >
                  <User size={22} />
                </Link>
                <div className="hidden md:flex items-center gap-3">
                  {session.user.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      className="hover:text-secondary transition-colors duration-300 font-body-sm text-body-sm flex items-center gap-1">
                      <LayoutDashboard size={18} />
                      لوحة التحكم
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      className="hover:text-secondary transition-colors duration-300 font-body-sm text-body-sm flex items-center gap-1">
                      <LayoutDashboard size={18} />
                      {session.user.name}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform cursor-pointer"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="hover:text-secondary transition-colors duration-300 scale-95 active:scale-90 transition-transform cursor-pointer"
              >
                <User size={22} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#1a1a2e] shadow-xl flex flex-col transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-lg">القائمة</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                الرئيسية
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                المتجر
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                الأقسام
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                تواصل معنا
              </Link>

              {session ? (
                <>
                  <hr className="my-4 border-gray-200 dark:border-gray-700" />
                  {session.user.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                    >
                      <LayoutDashboard size={18} />
                      لوحة التحكم
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                    >
                      <User size={18} />
                      {session.user.name}
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium cursor-pointer"
                  >
                    <LogOut size={18} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-4 border-gray-200 dark:border-gray-700" />
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
                  >
                    <User size={18} />
                    تسجيل الدخول
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
      />

      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
