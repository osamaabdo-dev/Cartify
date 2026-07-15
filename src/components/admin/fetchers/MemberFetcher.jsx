import { prisma } from "@/lib/prisma";
import MembersTable from "@/components/admin/tables/MembersTable";

export default async function MemberFetcher() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { orders: true } },
    },
    take: 100,
  });

  const data = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString().split("T")[0],
    _count: { orders: u._count.orders },
  }));

  return <MembersTable members={data} />;
}
