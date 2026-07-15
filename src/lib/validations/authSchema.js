import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email: z
      .string()
      .trim()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صالح"),
    password: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("البريد الإلكتروني غير صالح"),
    password: z
        .string()
        .min(6, "كلمة المرور يجب أن لا تقل عن 6 أحرف"),
});