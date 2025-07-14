import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { AcmeLogo } from "@/app/ui/navbar";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import Image from "next/image";

export default async function SideNav() {
  return (
    <div className="flex h-full flex-col  pb-4 md:px-0 md:py-0 ">
      <Link
        className="mb-2 flex h-24 items-end justify-start px-2  md:h-36 bg-gray-200"
        href="/"
      >
        <div className="">
          <Image
            src="/logo.png"
            width={250}
            height={240}
            className=""
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 px-3 md:px-0">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
