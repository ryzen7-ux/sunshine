"use client";

import { useActionState, useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { deleteRegion } from "@/app/lib/sun-actions";
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

export function DeleteRegion({ id }: { id: string }) {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDelete(true);
    const results = await deleteRegion(id);
    if (results.success === false) {
      setIsDelete(false);
      addToast({
        title: "Some error occuured!",
        color: "danger",
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
      <Tooltip color="danger" content="Delete Region">
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
