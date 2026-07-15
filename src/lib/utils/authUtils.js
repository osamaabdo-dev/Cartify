import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

export async function getAuthToken() {
  return getToken({
    req: { cookies: await cookies(), headers: await headers() },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export async function requireAdmin() {
  const token = await getAuthToken();
  if (token?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function requireAdminOrThrow() {
  const token = await getAuthToken();
  if (token?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return true;
}
