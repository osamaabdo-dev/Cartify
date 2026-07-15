"use server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations/categorySchema";
import { generateUniqueCategorySlug, saveCategoryImage } from "@/lib/utils/categoryServerUtils";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/utils/authUtils";

export async function getAllCategoriesAction() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, image: true },
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createCategoryAction(prevState, formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const imageFile = formData.get("image");

  const raw = {
    name: formData.get("name") || "",
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
  };

  const parsed = categorySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      data: raw,
      errors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]])
      ),
      success: false,
      message: "",
    };
  }

  const { name, description } = parsed.data;

  try {
    const slug = await generateUniqueCategorySlug(name);
    const imageUrl = await saveCategoryImage(imageFile);

    await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: imageUrl || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/products");
    return { success: true, data: null, errors: {}, message: "" };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        data: raw,
        success: false,
        errors: { name: "يوجد تصنيف بنفس الاسم بالفعل" },
        message: "",
      };
    }
    return {
      data: raw,
      success: false,
      errors: {},
      message: "حدث خطأ أثناء حفظ التصنيف. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function updateCategoryAction(prevState, formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const categoryId = formData.get("categoryId");
  const imageFile = formData.get("image");

  const raw = {
    name: formData.get("name") || "",
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
  };

  const parsed = categorySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      data: raw,
      errors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]])
      ),
      success: false,
      message: "",
    };
  }

  const { name, description } = parsed.data;

  try {
    const existing = await prisma.category.findFirst({
      where: { name, NOT: { id: categoryId } },
      select: { id: true },
    });
    if (existing) {
      return {
        data: raw,
        success: false,
        errors: { name: "يوجد تصنيف بنفس الاسم بالفعل" },
        message: "",
      };
    }

    const imageUrl = await saveCategoryImage(imageFile);

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description: description || null,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/products");
    return { success: true, data: null, errors: {}, message: "" };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        data: raw,
        success: false,
        errors: { name: "يوجد تصنيف بنفس الاسم بالفعل" },
        message: "",
      };
    }
    return {
      data: raw,
      success: false,
      errors: {},
      message: "حدث خطأ أثناء تحديث التصنيف. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function deleteCategoryAction(formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const categoryId = formData.get("categoryId");

  if (!categoryId) {
    return { success: false, message: "معرف التصنيف مطلوب" };
  }

  try {
    const productCount = await prisma.product.count({
      where: { categoryId },
    });

    if (productCount > 0) {
      return {
        success: false,
        productCount,
        message: "",
      };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/products");
    return { success: true, productCount, message: "" };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء حذف التصنيف. يرجى المحاولة مرة أخرى.",
    };
  }
}
