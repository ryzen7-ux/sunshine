import Image from "next/image";
import { DeleteInvoice } from "@/app/ui/mpesa/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import {
  formatDateToLocal,
  formatCurrency,
  formatCurrencyToLocal,
  formatPhoneNumber,
} from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/data";
import { fetchFilteredMpesaInvoices } from "@/app/lib/sun-data";
import { fetchFilteredMpesaInvoices2 } from "@/app/lib/sun-data2";
import EditMpesa from "@/app/ui/mpesa/edit-mpesa";

export default async function InvoicesTable({
  query,
  currentPage,
  user,
}: {
  query: string;
  currentPage: number;
  user: any;
}) {
  let ginvoices: any = [];
  if (user[0]?.role === "admin") {
    ginvoices = await fetchFilteredMpesaInvoices(query, currentPage);
  }

  if (user[0]?.role !== "admin") {
    ginvoices = await fetchFilteredMpesaInvoices2(
      query,
      currentPage,
      user[0]?.id
    );
  }

  if (!ginvoices || ginvoices.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">No invoices found.</div>
    );
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-200 p-2 md:pt-0">
          <div className="md:hidden">
            {ginvoices?.map((invoice: any, index: any) => (
              <div key={index} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p className="text-sm font-bold uppercase">
                        {invoice.refnumber}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-green-500 font-extrabold">
                    {invoice.transid}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      <strong>Name:</strong>{" "}
                      <span className="uppercase">{invoice.first_name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Cycle:</strong> {invoice.cycle}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Phone:</strong>{" "}
                      {formatPhoneNumber(invoice.phone_number)}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Date:</strong>{" "}
                      {formatDateToLocal(invoice.transtime)}
                    </p>
                    <p className="text-md font-extrabold text-green-600">
                      {formatCurrencyToLocal(invoice.transamount)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <EditMpesa mpesa={invoice} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className=" py-2 font-medium  pl-2">
                  Group/ID Number
                </th>
                <th>Name</th>
                <th>Phone Number</th>

                <th scope="col" className="py-2 font-medium">
                  Amount
                </th>
                <th scope="col" className=" py-2 font-medium">
                  Date
                </th>
                <th scope="col" className=" py-2 font-medium">
                  Transaction ID
                </th>
                <th scope="col" className=" py-2 font-medium">
                  Paid Cycle
                </th>
                <th scope="col" className="relative   ">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {ginvoices?.map((invoice: any, index: any) => (
                <tr
                  key={index}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-1 pr-3 pl-2">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">{invoice.refnumber}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap pr-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">
                        {invoice.first_name} {invoice.last_name}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap pr-3 ">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">
                        {formatPhoneNumber(invoice.phone_number)}
                      </p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap pr-3 text-xs">
                    {formatCurrencyToLocal(invoice.transamount)}
                  </td>
                  <td className="whitespace-nowrap py-3 text-xs flex justify-start pr-3">
                    {formatDateToLocal(invoice.transtime)}
                  </td>
                  <td className="whitespace-nowrap px-1 py-3 pr-3 text-xs text-green-500 font-extrabold ">
                    {invoice.transid}
                  </td>
                  <td className="whitespace-nowrap px-1 py-3 pr-3 text-xs text-green-500 font-extrabold ">
                    {invoice.cycle}
                  </td>
                  <td className=" flex pr-4 py-2">
                    <EditMpesa mpesa={invoice} />
                    <DeleteInvoice id={invoice.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
