import { prisma } from "@/lib/prisma";

export async function getProfileOrderById(orderId, userId) {
  const order = await prisma.order.findUnique({
    select: { id: true, orderNumber: true, userId: true, customerName: true, customerEmail: true, phone: true, address: true, city: true, district: true, country: true, paymentMethod: true, paymentStatus: true, subtotal: true, shipping: true, tax: true, total: true, status: true, createdAt: true, items: { select: { id: true, price: true, quantity: true, product: { select: { name: true, images: true } } } } },
    where: { id: orderId },
  });

  if (!order || order.userId !== userId) return null;

  return order;
}
