import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  // Rate limit AI generation and upload endpoints (max 30 requests per minute per IP)
  if (pathname.startsWith("/api/generate") || pathname.startsWith("/api/upload")) {
    const rateLimit = checkRateLimit(`ip_${ip}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: `Rate limit exceeded. Please wait ${Math.ceil(rateLimit.resetMs / 1000)} seconds before trying again.`,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        }
      );
    }
  }

  // Check session token for protected routes
  const hasSessionToken =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  // Protect /history route
  if (pathname.startsWith("/history") && !hasSessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/history/:path*", "/study/:path*", "/api/generate/:path*", "/api/upload/:path*"],
};
