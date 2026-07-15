"use server";

import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/authSchema";
import { hashPassword, comparePassword } from "@/lib/auth-utils";
import { rateLimit } from "@/lib/rate-limit";

export async function registerUser(prevState, formData) {
  const { allowed } = await rateLimit({ action: "register", max: 3, windowMs: 60000 });
  if (!allowed) return { success: false, message: "طلبات كثيرة جداً. حاول بعد دقيقة." };

  try {
    const raw = Object.fromEntries(formData);

    const parsed = registerSchema.safeParse(raw);

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten();
      const errors = {};
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          errors[field] = messages[0];
        }
      }
      return { success: false, errors };
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        success: false,
        message: "البريد الإلكتروني مستخدم بالفعل",
      };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
    });

    return { success: true, errors: {} };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.",
    };
  }
}
