import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import { Providers } from "./providers";
import { UserProvider } from "./providers/provider";
import { fetchUserByEmail } from "@/app/lib/sun-data";
import { SessionProvider } from "next-auth/react";
import { getSession } from "@/app/lib/session";

export const metadata: Metadata = {
  title: {
    template: "%s | Sunshine Jay Ventures",
    default: "Sunshine Jay Ventures",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  const curentUser: any = await fetchUserByEmail(user?.email);

  return (
    <html lang="en">
      <body
        className={`${inter.className} light antialiased "h-screen overflow-hidden`}
      >
        <UserProvider initialUser={curentUser[0]}>
          <Providers>{children}</Providers>
        </UserProvider>
      </body>
    </html>
  );
}
