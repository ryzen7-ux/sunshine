import Image from "next/image";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import {
  formatDateToLocal,
  formatCurrency,
  formatCurrencyToLocal,
} from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/data";
import { fetchFilteredMpesaInvoices } from "@/app/lib/sun-data";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  const ginvoices = await fetchFilteredMpesaInvoices(query, currentPage);

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
            {ginvoices?.map((invoice, index) => (
              <div key={index} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{invoice.refnumber}</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-500 font-extrabold">
                    {invoice.transid}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrencyToLocal(invoice.transamount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(invoice.transtime)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateInvoice id={invoice.id} /> */}
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Group
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Transaction ID
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {ginvoices?.map((invoice, index) => (
                <tr
                  key={index}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">{invoice.refnumber}</p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(invoice.transamount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatDateToLocal(invoice.transtime)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-green-500 font-extrabold">
                    {invoice.transid}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <DeleteInvoice id={invoice.id} />
                    </div>
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
