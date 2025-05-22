import { ArrowPathIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { LatestInvoice } from "@/app/lib/definitions";
import { fetchLatestInvoices } from "@/app/lib/data";

export default async function LatestInvoices() {
  // const latestInvoices = await fetchLatestInvoices();

  const inv = [
    {
      name: "Group 1",
      amount: "Ksh 7,000",
    },
    {
      name: "Group 2",
      amount: "Ksh 12,000",
    },
    {
      name: "Group 3",
      amount: "Ksh 8,000",
    },
    {
      name: "Group 4",
      amount: "Ksh 6,000",
    },
    {
      name: "Group 5",
      amount: "Ksh 11,000",
    },
  ];
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={` mb-4 text-xl md:text-2xl`}>Latest Group Invoices</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white px-6">
          {inv.map((invoice, i) => {
            return (
              <div
                key={i}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <UserGroupIcon
                    className="h-8
                   w-8 text-indigo-500"
                  />
                  <div className="min-w-0 ml-12">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                  </div>
                </div>
                <p
                  className={`truncate text-sm font-medium md:text-sm flex justify-center`}
                >
                  {invoice.amount}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
