import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "الاسم مطلوب")
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z
    .string()
    .trim()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[\d+\s\-()]+$/, "رقم الهاتف غير صالح"),
  email: z
    .string()
    .trim()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  message: z
    .string()
    .trim()
    .min(1, "نص الرسالة مطلوب")
    .min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});
