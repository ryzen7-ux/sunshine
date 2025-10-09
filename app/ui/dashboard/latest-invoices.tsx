import {
  ArrowPathIcon,
  UserGroupIcon,
  UserIcon,
  PhoneIcon,
  ClockIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { LatestInvoice } from "@/app/lib/definitions";
import { fetchLatestInvoices } from "@/app/lib/data";
import {
  fetchLatestGroupInvoices,
  fetchLatestMpesaInvoices,
} from "@/app/lib/sun-data";
import { formatDateToLocal, formatPhoneNumber } from "@/app/lib/utils";
import { Coins } from "lucide-react";

export default async function LatestInvoices() {
  // const latestInvoices = await fetchLatestInvoices();
  const latestInvoices = await fetchLatestMpesaInvoices();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={` mb-4 text-md md:text-lg flex gap-2 items-center`}>
        {" "}
        <Coins className="h-6 w-6 text-yellow-600" />
        Latest Mpesa Invoices
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-green-200 p-2">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white pr-2 rounded-xl shadow-lg">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={i}
                className={clsx(" py-4 pr-2", {
                  "border-t": i !== 0,
                })}
              >
                <div className="pl-2">
                  <DocumentArrowDownIcon className="h-5 w-5 fill-green-700" />
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center flex-wrap">
                    <div className="min-w-0 ml-6">
                      <p className="truncate text-sm font-semibold md:text-base">
                        Group: {invoice.refnumber}
                      </p>
                      <p className=" text-sm text-gray-700 sm:block">
                        Name: {invoice.first_name} {invoice.middle_name}{" "}
                        {invoice.last_name}
                      </p>
                      <p className=" text-sm text-gray-500 sm:block flex flex-wrap">
                        Phone Number: {formatPhoneNumber(invoice.phone_number)}
                      </p>
                      <p className=" text-sm text-gray-500 sm:block">
                        Time: {invoice.transtime}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p
                      className={`truncate text-sm font-extrabold md:text-lg flex justify-center`}
                    >
                      {invoice.transamount}
                    </p>
                    <p
                      className={`truncate text-md text-green-500 font-extrabold pt-2 flex justify-center`}
                    >
                      {invoice.transid}
                    </p>
                  </div>
                </div>
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
