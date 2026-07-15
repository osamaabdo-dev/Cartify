import { prisma } from "@/lib/prisma";
import CategoriesTable from "@/components/admin/tables/CategoriesTable";

export default async function CategoryFetcher() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    image: cat.image,
    createdAt: cat.createdAt.toISOString(),
    _count: { products: cat._count.products },
  }));

  return <CategoriesTable categories={data} />;
}
