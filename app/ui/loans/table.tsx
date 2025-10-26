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
import { fetchFilteredLoans2 } from "@/app/lib/sun-data2";
import { Tooltip } from "@heroui/react";

export default async function InvoicesTable({
  query,
  currentPage,
  loan,
  user,
}: {
  query: string;
  currentPage: number;
  loan: any;
  user: any;
}) {
  const isAdmin: any = user[0].role === "admin";
  let loans: any = [];

  if (isAdmin) {
    loans = await fetchFilteredLoans(query, currentPage);
  }
  if (!isAdmin) {
    loans = await fetchFilteredLoans2(query, currentPage, user[0]?.id);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <div className="md:hidden">
            {loans?.map((loan: any) => (
              <div
                key={loan.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="border-b pb-4 w-full">
                  <div>
                    <div className="mb-2 flex items-center justify-between w-full">
                      <p className="uppercase font-bold text-sm">
                        {loan.firstname} {loan.surname}
                      </p>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs">
                          {formatDateToLocal(loan.date)}
                        </p>
                        <InvoiceStatus status={loan.status} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 uppercase">
                      <strong>Group:</strong> {loan.name}
                    </p>
                    {/* <p className="text-sm text-gray-500">{loan.loanid}</p> */}
                    <p className="text-sm text-gray-500">
                      <strong>Start Date: </strong>
                      {formatDateToLocal(loan.start_date) ?? "Nill"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>End Date:</strong>{" "}
                      {formatDateToLocal(loan.end_date) ?? "Nill"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Cycle:</strong> {loan.cycle ?? 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Term:</strong> {Math.trunc(loan.term) ?? 0} weeks
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Interest:</strong> {loan.interest ?? 0} %
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Processing Fee and Charges:{" "}
                      {formatCurrencyToLocal(Number(loan.fee))}
                    </p>
                    <p className="text-sm font-bold text-gray-500">
                      Principal: {formatCurrencyToLocal(Number(loan.amount))}
                    </p>
                    <p className="text-sm font-bold text-gray-500">
                      Loan Amount: {formatCurrencyToLocal(Number(loan.total))}
                    </p>

                    <p className="text-sm font-bold text-green-500">
                      Total:{" "}
                      {formatCurrencyToLocal(
                        Number(loan.total) + Number(loan.fee)
                      )}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateLoan id={loan.id} loan={loan} />
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
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fee
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Loan
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  Cycle
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Rate
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Start Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  End Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loans?.map((loan: any) => (
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
                  <td className="whitespace-nowrap px-3 py-3 text-xs uppercase ">
                    {loan.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(Number(loan.amount))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(Number(loan.fee))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(Number(loan.total))}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(
                      Number(loan.total) + Number(loan.fee)
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {loan?.cycle ?? 0}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {loan.interest} %
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={loan.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatDateToLocal(loan.start_date) ?? "Nil"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatDateToLocal(loan.end_date) ?? "Nil"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatDateToLocal(loan.date)}
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateLoan id={loan.id} loan={loan} />
                      <DeleteLoan id={loan.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loans.length < 1 && (
        <div className="text-sm flex items-center justify-center py-6">
          No loans are added
        </div>
      )}
    </div>
  );
}
