"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { deleteLoan } from "@/app/lib/sun-actions";
import { Tooltip } from "@heroui/react";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/loans/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">New Loan</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateLoan({ id }: { id: string }) {
  return (
    <Tooltip color="success" content="Edit Loan">
      <Link
        href={`/dashboard/loans/${id}/edit`}
        className="rounded-md border p-2 hover:bg-green-100"
      >
        <PencilIcon className="w-4 fill-green-500" />
      </Link>
    </Tooltip>
  );
}

export function DeleteLoan({ id }: { id: string }) {
  const deleteLoanWithId = deleteLoan.bind(null, id);
  return (
    <>
      <Tooltip color="danger" content="Delete Loan Item">
        <form action={deleteLoanWithId}>
          <button
            type="submit"
            className="rounded-md border p-2 hover:bg-red-100"
          >
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-4 fill-red-500" />
          </button>
        </form>
      </Tooltip>
    </>
  );
}

export function ProcessDisbursement() {
  return (
    <Link
      href="/dashboard/loans/process-disbursement"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Process Disbursement</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
