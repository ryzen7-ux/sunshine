"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  DocumentCurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Home",
    href: "/dashboard",
    path: "/null",
    icon: HomeIcon,
    dash: "/dashboard",
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    path: "/invoices",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Groups",
    href: "/dashboard/customers",
    path: "/customers",
    icon: UserGroupIcon,
  },
  {
    name: "Loans and Disbursements",
    href: "/dashboard/loans",
    path: "/loans",
    icon: DocumentCurrencyDollarIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-200 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-green-200 text-green-600":
                  pathname === link?.dash || pathname.match(link?.path),
              }
            )}
          >
            <LinkIcon className="w-5 fill-gray-500" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
