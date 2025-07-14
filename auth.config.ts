import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isUpload = nextUrl.pathname.startsWith("/uploads");
      const isApi = nextUrl.pathname.startsWith("/mpesa-api");
      if (isOnDashboard || isUpload || isApi) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
