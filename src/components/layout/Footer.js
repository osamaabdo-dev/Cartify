import { APP_CONFIG } from "@/lib/constants";
import { ShoppingBag, Share2, Mail, ArrowLeft } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-tertiary-container w-full py-section-gap mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col gap-4">
          <div className="font-headline-sm text-headline-sm text-secondary flex items-center gap-2">
            <ShoppingBag size={24} fill="currentColor" />
            {APP_CONFIG.siteName}
          </div>
          <p className="font-body-sm text-body-sm text-on-primary-container/80 max-w-full sm:max-w-xs">
            Precise Luxury Gifting. Elevating the art of presenting fine
            fragrances and curated collections.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
              href="#"
            >
              <Share2 size={20} />
            </a>
            <a
              className="text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
              href="#"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-headline-sm text-headline-sm text-secondary font-bold mb-2">
            Quick Links
          </h4>
          <a
            className="font-body-sm text-body-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Our Boutiques
          </a>
          <a
            className="font-body-sm text-body-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Customer Support
          </a>
          <a
            className="font-body-sm text-body-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Shipping Info
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-headline-sm text-headline-sm text-secondary font-bold mb-2">
            Legal
          </h4>
          <a
            className="font-body-sm text-body-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="font-body-sm text-body-sm text-on-primary-container/80 hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-headline-sm text-headline-sm text-secondary font-bold mb-2">
            Newsletter
          </h4>
          <p className="font-body-sm text-body-sm text-on-primary-container/80 mb-2">
            Subscribe for exclusive offers.
          </p>
          <div className="flex">
            <input
              className="w-full bg-surface-container/10 text-on-primary border-none rounded-r-none rounded-l py-2 px-3 focus:ring-1 focus:ring-secondary outline-none font-body-sm text-body-sm placeholder:text-on-primary-container/50"
              placeholder="Email Address"
              type="email"
            />
            <button className="bg-secondary text-on-secondary px-4 rounded-l-none rounded-r hover:bg-secondary-fixed-dim transition-colors cursor-pointer">
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-on-primary-container/20 mt-12 pt-8 text-center">
        <p className="font-body-sm text-body-sm text-on-primary-container/60">
          © 2024 {APP_CONFIG.siteName}. All rights reserved. Precise Luxury Gifting.
        </p>
      </div>
    </footer>
  );
}
