import SideNav from "@/app/ui/dashboard/sidenav";
import UserAvatar from "@/app/ui/user-avatar";
import { auth } from "@/auth";

// export const experimental_ppr = true; // Enable PPR

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  const userTypes = {
    id: "",
    email: "",
    name: "",
    password: "",
    is_admin: false,
  };
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6  md:overflow-y-auto md:px-4 md:py-2">
        <div className="flex justify-end">
          <div className="  md:py-4 hidden md:block">
            <UserAvatar user={user?.user ?? userTypes} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
