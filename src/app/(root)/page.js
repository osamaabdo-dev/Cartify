import {
  getFeaturedProducts,
  getOnSaleProducts,
  serializeProduct,
} from "@/lib/utils/productServerUtils";
import { getAllCategories } from "@/lib/utils/categoryServerUtils";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import HomeSliders from "@/components/home/HomeSliders";

export default async function Home() {
  const [featuredProducts, onSaleProducts, categories] = await Promise.all([
    getFeaturedProducts(10),
    getOnSaleProducts(10),
    getAllCategories(),
  ]);

  return (
    <main className="flex-grow">
      <HeroSection />

      <section className="bg-white py-section-gap">
        <CategoriesSection categories={categories} />
      </section>

      <HomeSliders
        featuredProducts={featuredProducts.map(serializeProduct)}
        onSaleProducts={onSaleProducts.map(serializeProduct)}
        categories={categories}
      />
    </main>
  );
}
