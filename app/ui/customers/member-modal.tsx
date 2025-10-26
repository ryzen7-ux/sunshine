import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Avatar,
  Slider,
  Badge,
} from "@heroui/react";
import { MemberForm } from "@/app/lib/sun-defination";

import Image from "next/image";
import {
  LeftContent,
  RightContent,
} from "@/app/ui/customers/member-modal-content";

export default function MemberModal({
  isOpen,
  onOpenChange,
  memberData,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  memberData: any;
  onClose: any;
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        className="overflow-auto"
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
                  <RightContent memberData={memberData} />
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
