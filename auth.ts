import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { UserTypes } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import sql from "@/app/lib/db";
import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

async function getUser(email: string): Promise<UserTypes | undefined> {
  try {
    const user = await sql<
      UserTypes[]
    >`SELECT * FROM users WHERE email=${email}`;

    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});

export async function signIn(data: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await getUser(email);
  if (!user) {
    return { success: false, message: "No account found with that email!" };
  }
  const passwordMatch = await bcrypt.compare(password, user?.password);
  const userObj = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };
  if (passwordMatch && user) {
    await createSession(JSON.stringify(userObj));

    return { success: true, message: "Success" };
  }

  return { success: false, message: "Invalid credentials!" };
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}
