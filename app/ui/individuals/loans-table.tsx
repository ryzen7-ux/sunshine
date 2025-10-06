import Image from "next/image";
import { UpdateLoan, DeleteLoan } from "@/app/ui/loans/buttons";
import InvoiceStatus from "@/app/ui/loans/status";
import {
  formatDateToLocal,
  formatCurrency,
  formatCurrencyToLocal,
} from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/data";
import {
  fetchFilteredIndividuals,
  fetchRegions,
  fetchIndividuals,
  fetchFilteredIndividualLoans,
} from "@/app/lib/sun-data";
import { Tooltip } from "@heroui/react";
import EditLoan from "@/app/ui/individuals/edit-loan";
import DeleteIndividualLoan from "@/app/ui/individuals/delete-loan";

export default function LoansTable({
  filteredLoanIndividuals,
  loans,
  loansQuery,
  loansCurrentPage,
}: {
  filteredLoanIndividuals: any;
  loans: any;
  loansQuery: string;
  loansCurrentPage: number;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-green-100 p-2 md:pt-0">
          <div className="md:hidden">
            {loans?.map((individual: any) => (
              <div
                key={individual?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="pb-4">
                  <div>
                    <div className="mb-2 flex justify-between w-full">
                      <p>{individual.name}</p>
                      <div className="flex">
                        <p className="text-xs text-gray-700 px-4 pt-1">
                          {individual.created}
                        </p>
                        <EditLoan individual={individual} />{" "}
                        <DeleteIndividualLoan id={individual?.id} />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          ID Number: {individual.idnumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Region: {individual.region}
                        </p>
                        <p className="text-md font-bold pt-4">
                          Total: {formatCurrencyToLocal(individual.payment)}
                        </p>
                      </div>
                      <div>
                        {" "}
                        <p className="text-md text-green-500 font-bold">
                          {formatCurrencyToLocal(Math.trunc(individual.amount))}
                        </p>
                        <p className="text-sm text-gray-500">
                          Interest: {individual?.interest} %
                        </p>
                        <p className="text-sm text-gray-500">
                          Term: {individual?.term} Weeks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className=" py-2 font-medium ">
                  ID Number
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Region
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Interest
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Term
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Date
                </th>

                <th scope="col" className="relative py-2 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loans?.map((individual: any) => (
                <tr
                  key={individual.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">{individual?.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap  py-3 text-xs">
                    {individual.idnumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.region}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.interest} %
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.term} Weeks
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {formatCurrencyToLocal(individual.payment)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.created}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <EditLoan individual={individual} />
                      <DeleteIndividualLoan id={individual?.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredLoanIndividuals.length < 1 && (
        <div className="text-sm flex items-center justify-center py-6">
          No loans are added
        </div>
      )}
    </div>
  );
}
