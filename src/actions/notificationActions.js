"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/authUtils";

export async function getUnreadNotificationCount() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
  return prisma.adminNotification.count({ where: { isRead: false } });
}

export async function getRecentNotifications(limit = 10) {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
  return prisma.adminNotification.findMany({
    select: { id: true, type: true, title: true, message: true, link: true, isRead: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationAsRead(id) {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
  return prisma.adminNotification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead() {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
  return prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
}
