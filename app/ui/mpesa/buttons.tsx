"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteInvoice } from "@/app/lib/actions";
import { deleteGroupInvoice, deleteMpesaInvoice } from "@/app/lib/sun-actions";
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
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function CreateInvoice() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleDeleteParam = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("memberQuery");

    replace(`${pathname}?${params.toString()}`);
  }, 100);

  return (
    <>
      {" "}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">New Loan</span>{" "}
        <PlusIcon className="h-5 md:ml-4" />
      </button>
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setIsAddModalOpen(false);
          handleDeleteParam();
        }}
        size="xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Loan
              </ModalHeader>
              <ModalBody></ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
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
  const deleteInvoiceWithId = deleteMpesaInvoice.bind(null, id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip content="Delete transaction" color="danger" placement="bottom">
        <button onClick={onOpen} className="">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-6 h-6 text-red-500" />
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
