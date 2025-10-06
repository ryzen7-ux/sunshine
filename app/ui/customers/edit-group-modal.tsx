"use client";

import {
  Input,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Form,
  NumberInput,
  Select,
  SelectItem,
  Button,
  Spinner,
  addToast,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";
import { Search, Plus, Edit } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { updateGroup, State } from "@/app/lib/sun-actions";

export default function EditGroupModal({
  group,
  regions,
}: {
  group: any;
  regions: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [selectRegion, setRegion] = useState(group.region);
  const [reg, setReg] = useState(group.reg);
  const [name, setName] = useState(group.name);
  const [location, setLocation] = useState(group.location);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await updateGroup(formData);

    if (results?.success === false) {
      setIsloading(false);
      addToast({
        title: "Error !",
        description: results?.message,
        color: "danger",
      });
    } else {
      setIsloading(false);
      addToast({
        title: "Success!",
        description: results?.message,
        color: "success",
      });
      setIsModalOpen(false);
    }
  };
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        <Edit className="h-4 w-4 text-green-500" />
      </button>
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
                Edit Group
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col  px-6 w-full">
                    <div className="flex flex-col md:flex-row  gap-4">
                      <div className="w-full">
                        <Input
                          name="id"
                          className="hidden"
                          value={group.id}
                          readOnly
                        />
                        <Input
                          isRequired
                          name="reg"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Registration No/Code"
                          labelPlacement="outside"
                          color="success"
                          size="md"
                          description="Example: GRP001"
                          variant="faded"
                          value={reg}
                          onChange={(e) => setReg(e.target.value)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          isRequired
                          name="name"
                          type="text"
                          className="outline-2 outline-blue-500 mb-4 "
                          label="Name"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <div className="w-full">
                        <Input
                          isRequired
                          name="location"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Location"
                          labelPlacement="outside"
                          color="success"
                          size="md"
                          variant="faded"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <div className="w-full">
                        <Select
                          isRequired
                          name="region"
                          className=""
                          label="Group Region"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectRegion]}
                          onChange={(e) => {
                            setRegion(e.target.value);
                          }}
                        >
                          {regions.map((region: any, index: any) => (
                            <SelectItem key={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="my-6 py-6">
                      <Button
                        type="submit"
                        color="success"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner color="default" size="md" className="py-4" />
                        ) : (
                          "Update Group"
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
