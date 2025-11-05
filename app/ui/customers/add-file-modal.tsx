"use client";

import { useState } from "react";
import { EditIcon, FileText } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import EditMemberForm from "./edit-member-form";
import FilesForm from "./files-form";

export function AddFileModal({
  member,
  loanee,
}: {
  member: any;
  loanee: string;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isOpenLoan, setIsOpenLoan] = useState(false);

  return (
    <>
      <Tooltip color="primary" content="Add documents">
        <button onClick={() => setIsAddModalOpen(true)}>
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <FileText className="h-5 w-5 text-blue-500" />
          </span>
        </button>
      </Tooltip>
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
                Add Member Documents
              </ModalHeader>
              <ModalBody>
                <FilesForm member={member} onClose={onClose} loanee={loanee} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
