"use server";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/productSchema";
import { saveImage, getLatestProducts, getLatestProductsByCategory, serializeProduct } from "@/lib/utils/productServerUtils";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/utils/authUtils";
import { rateLimit } from "@/lib/rate-limit";

export async function createProductAction(prevState, formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const imageFile = formData.get("image");

  const raw = {
    name: formData.get("name") || "",
    slug: formData.get("slug") || "",
    price: formData.get("price") || "",
    sale_price: formData.get("sale_price") || "",
    stock: formData.get("stock") || "",
    description: formData.get("description") || "",
    categoryId: formData.get("categoryId") || "",
  };

  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      data: raw,
      errors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [
          key,
          msgs[0],
        ])
      ),
      success: false,
      message: "",
    };
  }

  const { name, slug, price, sale_price, stock, description, categoryId } = parsed.data;

  try {
    const slugExists = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (slugExists) {
      return {
        data: raw,
        success: false,
        errors: { slug: "هذا الرابط مستخدم بالفعل لمنتج آخر" },
        message: "",
      };
    }

    let category = await prisma.category.findFirst({
      where: { name: categoryId },
    });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryId,
          slug: categoryId.replace(/\s+/g, "-").toLowerCase(),
        },
      });
    }

    const imageUrl = await saveImage(imageFile);

    await prisma.product.create({
      data: {
        name,
        slug,
        price,
        sale_price,
        stock: Number(stock),
        description,
        images: imageUrl ? [imageUrl] : [],
        categoryId: category.id,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/categories");
    revalidatePath("/admin");
    return { success: true, data: null, errors: {}, message: "" };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        data: raw,
        success: false,
        errors: { slug: "هذا الرابط مستخدم بالفعل" },
        message: "",
      };
    }
    return {
      data: raw,
      success: false,
      errors: {},
      message: "حدث خطأ أثناء حفظ المنتج. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function updateProductAction(prevState, formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const productId = formData.get("productId");
  const imageFile = formData.get("image");

  if (!productId) {
    return { data: null, errors: {}, success: false, message: "معرف المنتج مطلوب" };
  }

  const raw = {
    name: formData.get("name") || "",
    slug: formData.get("slug") || "",
    price: formData.get("price") || "",
    sale_price: formData.get("sale_price") || "",
    stock: formData.get("stock") || "",
    description: formData.get("description") || "",
    categoryId: formData.get("categoryId") || "",
  };

  const parsed = productSchema.safeParse(raw);

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

  const { name, slug, price, sale_price, stock, description, categoryId } = parsed.data;

  try {
    const slugExists = await prisma.product.findFirst({
      where: { slug, NOT: { id: productId } },
      select: { id: true },
    });
    if (slugExists) {
      return {
        data: raw,
        success: false,
        errors: { slug: "هذا الرابط مستخدم بالفعل لمنتج آخر" },
        message: "",
      };
    }

    let category = await prisma.category.findFirst({
      where: { name: categoryId },
    });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryId,
          slug: categoryId.replace(/\s+/g, "-").toLowerCase(),
        },
      });
    }

    const imageUrl = await saveImage(imageFile);

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        price,
        sale_price,
        stock: Number(stock),
        description,
        categoryId: category.id,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/categories");
    revalidatePath("/admin");
    return { success: true, data: null, errors: {}, message: "" };
  } catch (error) {
    if (error.code === "P2002") {
      return {
        data: raw,
        success: false,
        errors: { slug: "هذا الرابط مستخدم بالفعل" },
        message: "",
      };
    }
    return {
      data: raw,
      success: false,
      errors: {},
      message: "حدث خطأ أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function toggleProductFeaturedAction(formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const productId = formData.get("productId");

  if (!productId) {
    return { success: false, message: "معرف المنتج مطلوب" };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isFeatured: true },
    });

    if (!product) {
      return { success: false, message: "المنتج غير موجود" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isFeatured: !product.isFeatured },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, isFeatured: !product.isFeatured, message: "" };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function toggleProductArchivedAction(formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const productId = formData.get("productId");

  if (!productId) {
    return { success: false, message: "معرف المنتج مطلوب" };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isArchived: true },
    });

    if (!product) {
      return { success: false, message: "المنتج غير موجود" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isArchived: !product.isArchived },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, isArchived: !product.isArchived, message: "" };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء تحديث المنتج. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function deleteProductAction(formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const productId = formData.get("productId");

  if (!productId) {
    return { success: false, message: "معرف المنتج مطلوب" };
  }

  try {
    const orderCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderCount > 0) {
      return {
        success: false,
        orderCount,
        message: "",
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, orderCount, message: "" };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function getLatestProductsAction(categoryId = null) {
  const products = categoryId
    ? await getLatestProductsByCategory(categoryId, 10)
    : await getLatestProducts(10);

  return products.map(serializeProduct);
}

export async function getStoreProductsAction({ search = "", categoryId = null } = {}) {
  const { allowed, retryAfter } = await rateLimit({ action: "store-products", max: 30, windowMs: 60000 });
  if (!allowed) {
    throw new Error(`Too many requests. Retry after ${retryAfter} seconds.`);
  }

  const where = { isArchived: false };

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return products.map(serializeProduct);
}
