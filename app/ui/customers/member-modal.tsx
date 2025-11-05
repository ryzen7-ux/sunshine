import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import Image from "next/image";
import {
  LeftContent,
  RightContent,
} from "@/app/ui/customers/member-modal-content";
import { EyeIcon } from "lucide-react";

export default function MemberModal({
  memberData,
  loan,
}: {
  memberData: any;
  loan: any;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const filteredLoans = loan
    ?.filter((item: any) => item.memberid === memberData.id)
    .sort((a: any, b: any) => b.date.localeCompare(a.date));

  return (
    <>
      <Tooltip color="warning" content="Member Details">
        <button
          onClick={() => {
            setIsAddModalOpen(true);
          }}
        >
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <EyeIcon className="h-6 w-6 text-yellow-500" />
          </span>
        </button>
      </Tooltip>
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={onOpenChange}
        size="full"
        className="overflow-auto"
        onClose={() => setIsAddModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Member Details
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col md:flex-row gap-4">
                  <LeftContent memberData={memberData} />
                  <RightContent memberData={memberData} loans={filteredLoans} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
