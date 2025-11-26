import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup"];
const lockedRoutes = ["/"];

export async function middleware(request: NextRequest) {
  // Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(path);
  const isLockedRoute = lockedRoutes.includes(path);
  const isLocke = path.startsWith("/");

  const cookieStore = await cookies();
  const cookie = (await cookies()).get("user-session")?.value;
  const oldCookie = (await cookies()).get("session")?.value;

  const locked = true;

  // if (oldCookie && !cookie) {
  //   cookieStore.delete("session");
  //   return NextResponse.redirect(new URL("/login", request.nextUrl));
  // }

  // if (isProtectedRoute && !cookie) {
  //   return NextResponse.redirect(new URL("/login", request.nextUrl));
  // }
  // if (isLockedRoute && cookie) {
  //   return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  // }
  // if (isLockedRoute && !cookie) {
  //   return NextResponse.redirect(new URL("/login", request.nextUrl));
  // }
  // if (
  //   isPublicRoute &&
  //   cookie &&
  //   !request.nextUrl.pathname.startsWith("/dashboard")
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  // }

  if (oldCookie && !cookie) {
    cookieStore.delete("session");
    return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }
  if (isProtectedRoute && cookie) {
    return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }
  if (isLockedRoute && cookie) {
    return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }
  if (isLockedRoute && !cookie) {
    return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }
  if (
    isPublicRoute &&
    cookie &&
    !request.nextUrl.pathname.startsWith("/locked")
  ) {
    return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }

  return NextResponse.next();
}

// export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
