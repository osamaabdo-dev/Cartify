import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/utils/productServerUtils";
import ProductContent from "@/components/products/ProductContent";
import { serializeProduct } from "@/lib/utils/productServerUtils";
export const dynamic = "force-dynamic";



export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);

  return (
    <ProductContent
      product={serializeProduct(product)}
      relatedProducts={relatedProducts.map(serializeProduct)}
    />
  );
}
