import Image from "next/image";
import { UpdateLoan, DeleteLoan } from "@/app/ui/loans/buttons";
import InvoiceStatus from "@/app/ui/loans/status";
import {
  formatDateToLocal,
  formatCurrency,
  formatCurrencyToLocal,
} from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/data";
import { fetchFilteredIndividuals, fetchRegions } from "@/app/lib/sun-data";
import { Tooltip } from "@heroui/react";
import EditIndividual from "@/app/ui/individuals/edit-individual";
import DeleteIndividual from "@/app/ui/individuals/delete-individual";
import { AddFileModal } from "@/app/ui/customers/add-file-modal";
import MemberModal from "@/app/ui/customers/member-modal";

export default function InvoicesTable({
  query,
  currentPage,
  filtredIndividuals,
  regions,
  detailLoans,
}: {
  query: string;
  currentPage: number;
  filtredIndividuals: any;
  regions: any;
  detailLoans: any;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-green-100 p-2 md:pt-0">
          <div className="md:hidden">
            {filtredIndividuals?.map((individual: any) => (
              <div
                key={individual?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className=" border-b pb-4">
                  <div>
                    <div className="mb-2 flex justify-between w-full">
                      <p>{individual.name}</p>
                      <div className="flex">
                        <EditIndividual
                          individual={individual}
                          regions={regions}
                        />{" "}
                        <DeleteIndividual id={individual?.id} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      ID Number {individual.idnumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      Phone Number {individual.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      Region: {individual.regionname}
                    </p>
                    <p className="text-sm text-gray-500">
                      Business: {individual.business}
                    </p>
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
                <th scope="col" className="px-4 py-2 font-medium ">
                  ID Number
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Phone Number
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Region
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Business
                </th>

                <th scope="col" className="relative py-2 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filtredIndividuals?.map((individual: any) => (
                <tr
                  key={individual.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xs">{individual?.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.idnumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.regionname}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {individual.business}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex gap-4">
                      <AddFileModal member={individual} loanee="individual" />
                      <MemberModal memberData={individual} loan={detailLoans} />
                      <EditIndividual
                        individual={individual}
                        regions={regions}
                      />

                      <DeleteIndividual id={individual?.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filtredIndividuals.length < 1 && (
        <div className="text-sm flex items-center justify-center py-6">
          No loans are added
        </div>
      )}
    </div>
  );
}
