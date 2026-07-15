"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { contactSchema } from "@/lib/validations/contactSchema";
import { rateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/utils/authUtils";

export async function createContactMessage({ name, phone, email, message }) {
  return prisma.contactMessage.create({
    data: { name, phone, email, message },
  });
}

export async function getAllContactMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return messages.map((m) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  }));
}

export async function getContactMessageById(id) {
  const m = await prisma.contactMessage.findUnique({ where: { id } });
  if (!m) return null;

  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email,
    message: m.message,
    createdAt: m.createdAt.toISOString(),
  };
}

const initialState = { success: false, errors: {}, message: "" };

export async function submitContactMessageAction(prevState, formData) {
  const { allowed } = await rateLimit({ action: "contact-message", max: 5, windowMs: 60000 });
  if (!allowed) return { success: false, errors: {}, message: "طلبات كثيرة جداً. حاول بعد دقيقة." };

  const raw = Object.fromEntries(formData);

  const parsed = contactSchema.safeParse(raw);

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

  try {
    await createContactMessage(parsed.data);
    revalidatePath("/contact");
    revalidatePath("/admin/contact-messages");
    return { success: true };
  } catch (error) {
    return { success: false, errors: {}, message: "حدث خطأ أثناء إرسال الرسالة" };
  }
}

export async function deleteContactMessageAction(id) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/contact-messages");
    return { success: true, message: "تم حذف الرسالة بنجاح" };
  } catch {
    return { success: false, message: "حدث خطأ أثناء حذف الرسالة" };
  }
}
