//@ts-nocheck
import SideNav from "@/app/ui/dashboard/sidenav";
import UserAvatar from "@/app/ui/user-avatar";
import { auth } from "@/auth";
import { cookies } from "next/headers";

// export const experimental_ppr = true; // Enable PPR

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userTypes = {
    id: "",
    email: "",
    name: "",
    password: "",
    is_admin: false,
  };
  const cookie = (await cookies()).get("user-session")?.value;
  const user = JSON.parse(cookie);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full flex-none md:w-64 ">
        <SideNav />
      </div>
      <div className="flex-grow p-2 md:overflow-y-auto md:px-4 md:py-2 overflow-y-auto h-dvh">
        <div className="flex justify-end">
          <div className="  md:py-4 hidden md:block">
            <UserAvatar user={user ?? userTypes} />
          </div>
        </div>
        {children}
        <div className="h-36 md:h-[10px]"></div>
      </div>
    </div>
  );
}
