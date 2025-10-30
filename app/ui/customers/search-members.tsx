"use client";

import { useState } from "react";
import {
  Input,
  Link,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Search, Plus } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import MemberForm from "./member-form";

export default function SearchMembers({ group }: { group: any }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="py-4 flex gap-4">
      <Input
        placeholder="Search members...."
        radius="lg"
        size="md"
        variant="faded"
        color="success"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        startContent={<Search className="h-6 w-6 text-gray-600" />}
      />
      <Button
        onPress={() => setIsAddModalOpen(true)}
        className="flex h-10 md:w-48 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        startContent={<Plus className="h-8 w-8" />}
      >
        Add Member
      </Button>
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
                Add Member
              </ModalHeader>
              <ModalBody>
                <MemberForm groupId={group?.id} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
