import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { localeCookie } from "@/i18n/routing";
import { defaultLocale, isLocale } from "@/lib/locale";

/** Keep locale routing internal while giving the root layout a prerenderable locale. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // These requests belong to infrastructure, not the localized App Router tree.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/api" ||
    pathname.startsWith("/emulator/") ||
    pathname.startsWith("/identitytoolkit.googleapis.com/") ||
    pathname.startsWith("/securetoken.googleapis.com/") ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) {
    const publicUrl = request.nextUrl.clone();
    publicUrl.pathname = pathname.slice(firstSegment.length + 1) || "/";
    return NextResponse.redirect(publicUrl);
  }

  const selectedLocale = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(selectedLocale) ? selectedLocale : defaultLocale;
  const destination = request.nextUrl.clone();
  destination.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.rewrite(destination);
  // The same public URL selects different internal pages for different cookies.
  response.headers.append("Vary", "Cookie");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|emulator/|identitytoolkit.googleapis.com/|securetoken.googleapis.com/).*)",
  ],
};
