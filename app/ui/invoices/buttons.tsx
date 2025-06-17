"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteInvoice } from "@/app/lib/actions";
import { deleteGroupInvoice } from "@/app/lib/sun-actions";
import {
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { AlertTriangleIcon } from "lucide-react";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 bg-green-100 hover:bg-green-200"
    >
      <PencilIcon className="w-5 text-green-500" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteGroupInvoice.bind(null, id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button
        onClick={onOpen}
        className="rounded-md border p-2 bg-red-100 hover:bg-red-200"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-red-500" />
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <AlertTriangleIcon className="h-8 w-8 text-red-500" />
              </ModalHeader>
              <ModalBody>
                <p className="text-lg">
                  Are you sure you want to delete this item?
                </p>
              </ModalBody>
              <ModalFooter>
                <form action={deleteInvoiceWithId}>
                  <Button type="submit" color="danger">
                    YES
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
