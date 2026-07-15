import { getLatestProducts } from "@/lib/utils/productServerUtils";
import { getAllCategories } from "@/lib/utils/categoryServerUtils";
import { serializeProduct } from "@/lib/utils/productServerUtils";
import StoreContent from "@/components/products/StoreContent";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getLatestProducts(),
    getAllCategories(),
  ]);

  return (
    <div className="bg-surface text-on-surface">
      <section className="relative bg-primary-container flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#283044]" />
        <div className="relative z-10 text-center px-6 py-20 md:py-28">
          <h1 className="text-on-primary text-4xl md:text-3xl font-headline font-bold mb-4">
            المتجر
          </h1>
          <p className="text-on-primary-container text-lg max-w-2xl mx-auto">
            استكشف مجموعتنا الفاخرة من الهدايا والعطور التي تعبر عن أرقى الأذواق.
          </p>
        </div>
      </section>
      <StoreContent
        initialProducts={products.map(serializeProduct)}
        categories={categories}
      />
    </div>
  );
}
