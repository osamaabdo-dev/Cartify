import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/productUtils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const PRODUCT_IMAGES_DIR = path.join(process.cwd(), "public", "product-images");

export async function generateUniqueSlug(name) {
  let slug = slugify(name);
  if (!slug) slug = "product";

  const existing = await prisma.product.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (!existing) return slug;

  let counter = 1;
  while (true) {
    const candidate = `${slug}-${counter}`;
    const found = await prisma.product.findFirst({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!found) return candidate;
    counter++;
  }
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveImage(file) {
  if (!file || !(file instanceof File) || file.size === 0) return "";
  if (file.size > MAX_IMAGE_SIZE) return "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
  await writeFile(path.join(PRODUCT_IMAGES_DIR, filename), buffer);

  return `/product-images/${filename}`;
}

export async function getProductBySlug(slug) {
  const decoded = decodeURIComponent(slug).normalize("NFC");
  const product = await prisma.product.findUnique({
    where: { slug: decoded },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
  if (!product) {
    const byFallback = await prisma.product.findFirst({
      where: { slug: { contains: decoded } },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return byFallback || null;
  }
  return product;
}

export async function getRelatedProducts(product, take = 4) {
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isArchived: false,
    },
    take,
    orderBy: { createdAt: "desc" },
  });
  return related;
}

export async function getFeaturedProducts(take = 10) {
  return prisma.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { category: { select: { id: true, name: true, slug: true } } },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOnSaleProducts(take = 10) {
  return prisma.product.findMany({
    where: {
      sale_price: { not: null },
      isArchived: false,
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestProducts(take = 50) {
  return prisma.product.findMany({
    where: { isArchived: false },
    include: { category: { select: { id: true, name: true, slug: true } } },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestProductsByCategory(categoryId, take = 10) {
  return prisma.product.findMany({
    where: { isArchived: false, categoryId },
    include: { category: { select: { id: true, name: true, slug: true } } },
    take,
    orderBy: { createdAt: "desc" },
  });
}

export function serializeProduct(p) {
  function serialize(val) {
    if (val === null || val === undefined) return val;
    if (typeof val === "object" && "toNumber" in val) return Number(val);
    if (val instanceof Date) return val.toISOString();
    return val;
  }

  const raw = { ...p };
  for (const key of Object.keys(raw)) {
    if (key === "category" && raw.category) {
      raw.category = { ...raw.category };
      for (const ck of Object.keys(raw.category)) {
        raw.category[ck] = serialize(raw.category[ck]);
      }
    } else {
      raw[key] = serialize(raw[key]);
    }
  }
  return raw;
}
