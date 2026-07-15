"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/utils/authUtils";

export async function deleteMemberAction(formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };
  const userId = formData.get("userId");

  if (!userId) {
    return { success: false, message: "معرف العضو مطلوب" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return { success: false, message: "العضو غير موجود" };
    }

    if (user.role === "ADMIN") {
      return { success: false, isAdmin: true, message: "" };
    }

    const orderCount = await prisma.order.count({
      where: { userId },
    });

    if (orderCount > 0) {
      return { success: false, orderCount, message: "" };
    }

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true, orderCount, message: "" };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء حذف العضو. يرجى المحاولة مرة أخرى.",
    };
  }
}
