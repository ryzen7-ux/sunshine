"use client";

import { useActionState, useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { deleteStaff } from "@/app/lib/sun-actions";
import {
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  addToast,
  Spinner,
} from "@heroui/react";
import { Trash2Icon, Trash2, Eye, Pen, AlertTriangleIcon } from "lucide-react";

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

export function DeleteStaff({ id }: { id: string }) {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDelete(true);
    const results = await deleteStaff(id);
    if (results.success === false) {
      setIsDelete(false);
      addToast({
        color: "danger",
        title: "Some error occured",
      });
    }
    if (results.success === true) {
      setIsDelete(false);
      addToast({
        title: "Item deleted!",
        color: "warning",
      });
    }
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip color="danger" content="Delete Loan Item">
        <button onClick={onOpen} className="">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-4 fill-red-500" />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <AlertTriangleIcon className="h-8 w-8 text-red-500" />
              </ModalHeader>
              <ModalBody>
                <p className="text-lg">
                  Are you sure you want to delete this member?
                </p>
              </ModalBody>
              <ModalFooter>
                <form onSubmit={handleDelete}>
                  <input value={id} readOnly className="hidden" />
                  <Button type="submit" color="danger" disabled={isDelete}>
                    {isDelete ? (
                      <Spinner size="sm" color="default"></Spinner>
                    ) : (
                      "YES"
                    )}
                  </Button>
                </form>
                <Button color="primary" onPress={onClose}>
                  NO
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
