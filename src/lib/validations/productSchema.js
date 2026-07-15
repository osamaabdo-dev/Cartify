import {z} from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "اسم المنتج مطلوب"),
    slug: z.string().min(1, "الرابط المختصر مطلوب").trim(),
    price: z
        .string()
        .min(1, "السعر مطلوب")
        .transform((v) => Number(v))
        .pipe(z.number().positive("السعر يجب أن يكون أكبر من 0")),
    sale_price: z.preprocess(
        (v) => v === "" || v === null || v === undefined ? null : Number(v),
        z.number({invalid_type_error: "سعر العرض يجب أن يكون رقماً"})
            .positive("سعر العرض يجب أن يكون أكبر من 0")
            .nullable()
            .default(null)
    ),
    stock: z
        .string()
        .min(1, "المخزون مطلوب")
        .transform((v) => Number(v))
        .pipe(z.number().int("المخزون يجب أن يكون رقماً صحيحاً").min(0, "المخزون لا يمكن أن يكون سالباً")),
    description: z.string().min(1, "وصف المنتج مطلوب").default(""),
    categoryId: z.string().min(1, "التصنيف مطلوب"),
    imageUrl: z.string().optional().default(""),
}).refine(
    (data) => data.sale_price === null || data.sale_price < data.price,
    { message: "سعر العرض يجب أن يكون أقل من السعر الأساسي", path: ["sale_price"] }
);