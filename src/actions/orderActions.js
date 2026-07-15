"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkoutSchema } from "@/lib/validations/orderSchema";
import { requireAdmin } from "@/lib/utils/authUtils";
import { rateLimit } from "@/lib/rate-limit";
import { formatCurrency } from "@/lib/utils/dashboardUtils";
import { randomUUID } from "crypto";

function parsePrice(price) {
  const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

async function generateOrderNumber() {
  const counter = await prisma.$transaction(async (tx) => {
    const row = await tx.orderCounter.findUnique({ where: { id: "singleton" } });
    if (!row) {
      await tx.orderCounter.create({ data: { id: "singleton", nextValue: 1001 } });
      return "ORD-1000";
    }
    const value = row.nextValue;
    await tx.orderCounter.update({
      where: { id: "singleton" },
      data: { nextValue: { increment: 1 } },
    });
    return `ORD-${value}`;
  });
  return counter;
}

export async function createOrder(prevState, formData) {
  const { allowed } = await rateLimit({ action: "create-order", max: 10, windowMs: 3600000 });
  if (!allowed) return { success: false, errors: {}, message: "طلبات كثيرة جداً. حاول بعد ساعة." };

  try {
    const raw = Object.fromEntries(formData);
    const cartItemsRaw = raw.cartItems;
    const userIdRaw = raw.userId;

    const { cartItems: _c, userId: _u, ...textFields } = raw;

    let cartItems = [];
    if (cartItemsRaw) {
      try {
        cartItems = JSON.parse(cartItemsRaw);
      } catch {
        return { success: false, errors: {}, message: "بيانات السلة غير صالحة" };
      }
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { success: false, errors: {}, message: "السلة فارغة" };
    }

    const userId = !userIdRaw || userIdRaw === "" ? null : userIdRaw;

    const parsed = checkoutSchema.safeParse(textFields);

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

    const data = parsed.data;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + parsePrice(item.price) * item.quantity,
      0,
    );
    const shipping = 3;
    const total = subtotal + shipping;

    const orderNumber = await generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          phone: data.phone,
          address: data.address,
          city: data.city,
          district: data.district,
          country: data.country || "الأردن",
          paymentMethod: data.paymentMethod,
          paymentStatus: "pending",
          subtotal,
          shipping,
          tax: 0,
          total,
          items: {
            create: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: parsePrice(item.price),
            })),
          },
        },
        include: { items: true },
      });
    });

    await prisma.adminNotification.create({
      data: {
        id: randomUUID(),
        type: "new-order",
        title: `طلب جديد ${orderNumber}`,
        message: `من ${data.customerName} - ${formatCurrency(total)}`,
        link: `/admin/orders/${order.id}`,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true, orderNumber: order.orderNumber, errors: {} };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ غير متوقع أثناء معالجة طلبك، يرجى المحاولة مرة أخرى.",
    };
  }
}

export async function updateOrderStatusAction(formData) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (!orderId || !status) {
    return { success: false, message: "معرف الطلب والحالة مطلوبان" };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true, message: "" };
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء تحديث حالة الطلب.",
    };
  }
}
