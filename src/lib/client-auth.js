import { signIn } from "next-auth/react";
import {loginSchema} from "@/lib/validations/authSchema";


export async function loginActionHelper(formData) {
  const raw = Object.fromEntries(formData);

  const parsed = loginSchema.safeParse(raw);
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

  const { email, password } = parsed.data;

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return {
      success: false,
      message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      errors: {},
    };
  }

  return { success: true, errors: {} };
}
