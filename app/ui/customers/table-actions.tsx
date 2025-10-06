//@ts-nocheck

import { deleteGroup, deleteMember } from "@/app/lib/sun-actions";
import { Trash2Icon, Trash2, Eye, Pen, AlertTriangleIcon } from "lucide-react";
import {
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Spinner,
  addToast,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { SuccessToast, DeleteSuccessToast } from "@/app/ui/toast";

export function DeleteGroupAction({ id }: { id: string }) {
  // const deleteGroupWithId = deleteGroup.bind(null, id);
  const initialState = { success: false };
  const [formstate, formAction, isLoading] = useActionState(
    deleteGroup,
    initialState
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip color="danger" content="Delete Group">
        <button onClick={onOpen}>
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <Trash2 className="h-5 w-5" />
          </span>
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
                <form action={formAction}>
                  <input type="hidden" name="id" defaultValue={id} />
                  <Button type="submit" color="danger" disabled={isLoading}>
                    {isLoading ? <Spinner size="md" color="default" /> : "YES"}
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

export function DeleteMemberAction({ id, gid }: { id: string; gid: string }) {
  const deleteMemberWithId = deleteMember.bind(null, id, gid);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button onClick={onOpen}>
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <Trash2 className="h-5 w-5" />
        </span>
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
                <form action={deleteMemberWithId}>
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
