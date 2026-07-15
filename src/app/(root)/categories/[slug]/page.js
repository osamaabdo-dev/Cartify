import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryProducts } from "@/lib/utils/categoryServerUtils";
import { serializeProduct } from "@/lib/utils/productServerUtils";
import CategoryContent from "@/components/products/CategoryContent";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getCategoryProducts(category.id);

  return (
    <CategoryContent
      products={products.map(serializeProduct)}
      categoryName={category.name}
    />
  );
}
