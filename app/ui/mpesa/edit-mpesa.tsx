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
import { updateMpesaInvoice } from "@/app/lib/sun-actions";

export default function EditMpesa({ mpesa }: { mpesa: any }) {
  const [isLoading, setIsloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [group, setGroup] = useState(mpesa?.refnumber);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await updateMpesaInvoice(formData);
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
            className=""
            onClick={(event) => {
              setIsModalOpen(true);
            }}
          >
            <Edit className="h-6 w-6 text-green-500 hover:text-green-600" />
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
                Update Mpesa Transaction
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col py-4  rounded-md  w-full">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Input
                        name="id"
                        className="hidden"
                        value={mpesa.id}
                        readOnly
                      />
                      <div className="w-full">
                        <Input
                          isRequired
                          name="group"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Group/Id Number"
                          labelPlacement="outside"
                          placeholder=""
                          color="success"
                          size="md"
                          variant="faded"
                          value={group}
                          onChange={(e) => setGroup(e.target.value)}
                          description="ID Number for individuals not in groups"
                        />
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
                          "Update Transaction"
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
