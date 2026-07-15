import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProductAction } from "@/actions/productActions";
import ProductForm from "@/components/admin/forms/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: String(product.price),
    sale_price: product.sale_price ? String(product.sale_price) : "",
    stock: String(product.stock),
    description: product.description || "",
    categoryId: product.category.name,
    images: product.images,
  };

  return (
    <ProductForm
      action={updateProductAction}
      initial={initial}
      categories={categories}
    />
  );
}
