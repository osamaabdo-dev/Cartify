import {z} from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "اسم التصنيف مطلوب"),
    description: z.string().optional().default(""),
    imageUrl: z.string().optional().default(""),
});
