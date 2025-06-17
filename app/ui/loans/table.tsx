import Image from "next/image";
import { UpdateLoan, DeleteLoan } from "@/app/ui/loans/buttons";
import InvoiceStatus from "@/app/ui/loans/status";
import {
  formatDateToLocal,
  formatCurrency,
  formatCurrencyToLocal,
} from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/data";
import { fetchFilteredLoans } from "@/app/lib/sun-data";
import { Tooltip } from "@heroui/react";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const loans = await fetchFilteredLoans(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <div className="md:hidden">
            {loans?.map((loan) => (
              <div
                key={loan.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>
                        {loan.firstname} {loan.surname}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{loan.loanid}</p>
                  </div>
                  <div>
                    <InvoiceStatus status={loan.status} />
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrencyToLocal(loan.amount)}
                    </p>
                    <p>{formatDateToLocal(loan.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateLoan id={loan.id} />
                    <DeleteLoan id={loan.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Borrower
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Group
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Loan ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Remaining
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Rate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loans?.map((loan) => (
                <tr
                  key={loan.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">
                        {loan.firstname} {loan.surname}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {loan.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {loan.loanid}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(loan.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs"></td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {loan.interest} %
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={loan.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateLoan id={loan.id} />
                      <DeleteLoan id={loan.id} />
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
