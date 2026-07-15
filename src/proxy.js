import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const SECURITY_HEADERS = {
  "Content-Security-Policy": CSP,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Access-Control-Allow-Origin": process.env.NEXTAUTH_URL || "http://localhost:3000",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function isAdminRoute(pathname) {
  return pathname.startsWith("/admin");
}

function isProfileRoute(pathname) {
  return pathname.startsWith("/profile");
}

const authMiddleware = withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;
      if (isAdminRoute(req.nextUrl.pathname) && token.role !== "ADMIN") return false;
      return true;
    },
  },
});

export default async function proxy(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  const { allowed } = await rateLimit({
    action: `proxy:${request.nextUrl.pathname}`,
    max: 50,
    windowMs: 60000,
    ip,
  });

  if (!allowed) {
    return new NextResponse("طلبات كثيرة جداً. حاول بعد دقيقة.", { status: 429 });
  }

  const response = await authMiddleware(request);
  if (!response) return;

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};


