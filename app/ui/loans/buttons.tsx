"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { deleteLoan } from "@/app/lib/sun-actions";
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
import { Trash2Icon, Trash2, Eye, Pen, AlertTriangleIcon } from "lucide-react";
import CreateLoanForm from "./loan-from";
import EditLoanForm from "./edit-form";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function CreateInvoice({
  groups,
  members,
}: {
  groups: any;
  members: any;
}) {
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
              <ModalBody>
                <CreateLoanForm
                  groups={groups}
                  members={members}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function UpdateLoan({ id, loan }: { id: string; loan: any }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  return (
    <>
      {" "}
      <Tooltip color="success" content="Edit Loan">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="rounded-md border p-2 hover:bg-green-100"
        >
          <PencilIcon className="w-4 fill-green-500" />
        </button>
      </Tooltip>
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        size="xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Loan
              </ModalHeader>
              <ModalBody>
                <EditLoanForm loan={loan} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function DeleteLoan({ id }: { id: string }) {
  const deleteLoanWithId = deleteLoan.bind(null, id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip color="danger" content="Delete Loan Item">
        <button
          onClick={onOpen}
          className="rounded-md border p-2 hover:bg-red-100"
        >
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
                  Are you sure you want to delete this item?
                </p>
              </ModalBody>
              <ModalFooter>
                <form action={deleteLoanWithId}>
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
