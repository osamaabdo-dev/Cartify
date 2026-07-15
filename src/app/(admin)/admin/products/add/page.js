import { prisma } from "@/lib/prisma";
import { createProductAction } from "@/actions/productActions";
import ProductForm from "@/components/admin/forms/ProductForm";

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <ProductForm action={createProductAction} categories={categories} />;
}
