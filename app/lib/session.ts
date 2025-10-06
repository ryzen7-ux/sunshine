import "server-only";
import { cookies } from "next/headers";

export async function createSession(userId: any) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = userId;
  const cookieStore = await cookies();

  cookieStore.set("user-session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete("user-session");
}
