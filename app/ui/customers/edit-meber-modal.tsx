"use client";

import { useState } from "react";
import { EditIcon } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import EditMemberForm from "./edit-member-form";

export function EditMemberModal({ member }: { member: any }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isOpenLoan, setIsOpenLoan] = useState(false);

  return (
    <>
      <button onClick={() => setIsAddModalOpen(true)}>
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon className="h-5 w-5 text-green-500" />
        </span>
      </button>
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        size="xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Member Details
              </ModalHeader>
              <ModalBody>
                <EditMemberForm member={member} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
