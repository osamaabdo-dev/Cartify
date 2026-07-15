import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/productUtils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const CATEGORY_IMAGES_DIR = path.join(process.cwd(), "public", "category-images");

export async function generateUniqueCategorySlug(name) {
  let slug = slugify(name);
  if (!slug) slug = "category";

  const existing = await prisma.category.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (!existing) return slug;

  let counter = 1;
  while (true) {
    const candidate = `${slug}-${counter}`;
    const found = await prisma.category.findFirst({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!found) return candidate;
    counter++;
  }
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveCategoryImage(file) {
  if (!file || !(file instanceof File) || file.size === 0) return "";
  if (file.size > MAX_IMAGE_SIZE) return "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await mkdir(CATEGORY_IMAGES_DIR, { recursive: true });
  await writeFile(path.join(CATEGORY_IMAGES_DIR, filename), buffer);

  return `/category-images/${filename}`;
}

export async function getCategoryTree() {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    select: { id: true, name: true, slug: true, image: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug) {
  const decoded = decodeURIComponent(slug).normalize("NFC");

  let category = await prisma.category.findUnique({
    where: { slug: decoded },
  });

  if (!category) {
    category = await prisma.category.findFirst({
      where: { slug: { contains: decoded } },
    });
  }

  return category;
}

export async function getCategoryProducts(categoryId) {
  return prisma.product.findMany({
    where: { categoryId, isArchived: false },
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
