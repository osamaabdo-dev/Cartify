import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  customerEmail: z
    .string()
    .trim()
    .min(1, "هذا الحقل مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  phone: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .regex(/^[\d\s\-+()]{7,20}$/, "رقم الهاتف غير صالح"),
  address: z
    .string()
    .trim()
    .min(1, "هذا الحقل مطلوب"),
  city: z
    .string()
    .trim()
    .min(1, "هذا الحقل مطلوب"),
  district: z
    .string()
    .trim()
    .min(1, "هذا الحقل مطلوب"),
  country: z
    .string()
    .min(1, "هذا الحقل مطلوب")
    .default("الأردن"),
  paymentMethod: z.enum(["CARD", "COD"], {
    errorMap: () => ({ message: "طريقة الدفع غير صالحة" }),
  }),
});
