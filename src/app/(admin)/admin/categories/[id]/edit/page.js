import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCategoryAction } from "@/actions/categoryActions";
import { CategoryForm } from "@/components/admin/forms/CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) notFound();

  const initialData = {
    id: category.id,
    name: category.name,
    description: category.description || "",
    image: category.image || "",
  };

  return (
    <CategoryForm
      initialData={initialData}
      action={updateCategoryAction}
      title="تعديل التصنيف"
      subtitle="قم بتحديث معلومات هذا التصنيف."
      submitLabel="حفظ التغييرات"
      isEdit
    />
  );
}
