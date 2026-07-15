import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/utils/authUtils";
import ProfileOrdersTable from "@/components/profile/tables/ProfileOrdersTable";

export default async function ProfileOrdersFetcher() {
  const token = await getAuthToken();

  if (!token?.id) {
    return (
      <div className="py-24 text-center">
        <p className="text-[#45464d] text-lg">لم يتم العثور على بيانات المستخدم</p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    select: { id: true, orderNumber: true, total: true, status: true, createdAt: true, _count: { select: { items: true } } },
    where: { userId: token.id },
    orderBy: { createdAt: "desc" },
  });

  const data = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    total: Number(o.total),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    itemsCount: o._count.items,
  }));

  return <ProfileOrdersTable orders={data} />;
}
