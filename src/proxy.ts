import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isBooking = pathname.startsWith("/booking");
  const isAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isBooking && !request.cookies.get("sakura_user")?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirect", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (isAdmin && request.cookies.get("sakura_admin")?.value !== "active") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/booking/:path*", "/admin/:path*"],
};
