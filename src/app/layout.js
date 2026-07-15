import { Tajawal } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import Providers from "@/components/layout/Providers";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: `${APP_CONFIG.siteName} - Home`,
  description: "المتجر الفاخر للهدايا العربية الأصيلة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`antialiased ${tajawal.className}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
