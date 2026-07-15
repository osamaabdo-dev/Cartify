import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/tables/OrdersTable";

export default async function OrderFetcher() {
  const orders = await prisma.order.findMany({
    select: {
      id: true, orderNumber: true, customerName: true, customerEmail: true,
      phone: true, city: true, district: true, paymentMethod: true,
      paymentStatus: true, subtotal: true, shipping: true, total: true,
      status: true, createdAt: true,
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const data = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    phone: o.phone,
    city: o.city,
    district: o.district,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    itemsCount: o._count.items,
  }));

  return <OrdersTable orders={data} />;
}
