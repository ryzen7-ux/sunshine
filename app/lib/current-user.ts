"use server";
import { cookies } from "next/headers";
import { fetchUserByEmail } from "./sun-data";
import { deleteSession } from "@/app/lib/session";

export async function getCurrentUser() {
  const cookie = (await cookies()).get("user-session")?.value as string;
  const parsedUser = JSON.parse(cookie);
  const user = await fetchUserByEmail(parsedUser.email);

  return user;
}
