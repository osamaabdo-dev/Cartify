import { createCategoryAction } from "@/actions/categoryActions";
import { CategoryForm } from "@/components/admin/forms/CategoryForm";

export const dynamic = "force-dynamic";

export default function AddCategoryPage() {
  return (
    <CategoryForm
      initialData={null}
      action={createCategoryAction}
      title="إضافة تصنيف"
      subtitle="أضف تصنيفاً جديداً لتنظيم منتجاتك."
      submitLabel="حفظ التصنيف"
    />
  );
}
