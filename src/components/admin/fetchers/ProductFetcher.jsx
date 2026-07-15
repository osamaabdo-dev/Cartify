import { prisma } from "@/lib/prisma";
import ProductsTable from "@/components/admin/tables/ProductsTable";

export default async function ProductFetcher() {
  const products = await prisma.product.findMany({
    select: {
      id: true, name: true, slug: true, price: true, stock: true,
      images: true, isFeatured: true, isArchived: true,
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryName: p.category.name,
    price: Number(p.price),
    stock: p.stock,
    image: p.images?.[0] || "",
    isFeatured: p.isFeatured,
    isArchived: p.isArchived,
  }));

  const categories = [
    "الكل",
    ...new Set(data.map((p) => p.categoryName)),
  ];

  return <ProductsTable products={data} categories={categories} />;
}
