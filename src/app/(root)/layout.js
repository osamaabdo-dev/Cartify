import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
