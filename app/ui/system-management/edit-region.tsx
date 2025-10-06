"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Input,
  Spinner,
  addToast,
  Select,
  SelectItem,
  Tooltip,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { Edit } from "lucide-react";
import { updateRegion } from "@/app/lib/sun-actions";

export default function EditRegion({
  users,
  region,
}: {
  users: any;
  region: any;
}) {
  const [formData, setFormData] = useState({
    name: region?.name || "",
    county: region?.county || "",
  });

  const [isLoading, setIsloading] = useState(false);
  const [selectManager, setManager] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await updateRegion(formData);
    console.log(results);
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
      <div className="flex justify-between w-full ">
        <Tooltip color="success" content="Edit Details">
          <button
            className="pr-3"
            onClick={(event) => {
              setIsModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4 text-green-500 hover:text-green-600" />
          </button>
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
                Edit Region
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col py-4  rounded-md  w-full">
                    <div className="flex flex-col md:flex-row  gap-4">
                      <Input
                        name="id"
                        className="hidden"
                        value={region.id}
                        readOnly
                      />
                      <div className="w-full">
                        <Input
                          isRequired
                          name="name"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Name"
                          labelPlacement="outside"
                          placeholder=""
                          color="success"
                          size="md"
                          variant="faded"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          isRequired
                          name="county"
                          type="text"
                          className="outline-2 outline-blue-500 mb-4 "
                          label="County"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={formData.county}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <div className="w-full">
                        <Select
                          isRequired
                          name="manager"
                          className=""
                          label="Region manager"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectManager]}
                          onChange={(e) => setManager(e.target.value)}
                        >
                          {users.map((user: any, index: any) => (
                            <SelectItem key={user.id}>{user.name}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="my-6 py-6 flex gap-4">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner color="default" size="md" className="py-4" />
                        ) : (
                          "Update Region"
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
