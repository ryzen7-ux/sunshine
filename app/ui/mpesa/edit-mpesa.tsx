"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Button,
} from "@heroui/react";
import { useUser } from "@/app/providers/provider";
import { Edit, Landmark } from "lucide-react";
import EditMpesaForm from "./edit-form";

export default function EditMpesa({ mpesa }: { mpesa: any }) {
  const { user }: { user: any } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <div className="flex justify-between w-full ">
        <Tooltip color="success" content="Edit Details">
          <Button
            size="sm"
            className="bg-white "
            onPress={() => {
              setIsModalOpen(true);
            }}
            isDisabled={user?.role !== "admin"}
          >
            <Edit className="h-6 w-6 text-green-500 hover:text-green-600" />
          </Button>
        </Tooltip>
      </div>
      {/* Is add staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onOpenChange}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Mpesa Transaction
              </ModalHeader>
              <ModalBody>
                <EditMpesaForm mpesa={mpesa} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function EditMpesaButton() {
  return;
  <div className="flex justify-between w-full ">
    <Tooltip color="success" content="Edit Details">
      <button className="">
        <Edit className="h-6 w-6 text-green-500 hover:text-green-600" />
      </button>
    </Tooltip>
  </div>;
}
