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
  NumberInput,
  Tooltip,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { updateIndividual } from "@/app/lib/sun-actions";
import { number } from "zod";
import { Edit } from "lucide-react";

const roles = [
  { key: "admin", label: "Admin" },
  { key: "manager", label: "Manager" },
  { key: "staff", label: "Staff" },
];
const status = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "on-leave", label: "On-Leave" },
];

export default function AddIndividual({
  individual,
  regions,
}: {
  regions: any;
  individual: any;
}) {
  const [formData, setFormData] = useState({
    name: individual?.name || "",
    phone: individual?.phone || "",
    business: individual?.business || "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [selectRegion, setRegion] = useState(individual?.region);
  const [idNumber, setIdNumber] = useState<number>(individual?.idnumber);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await updateIndividual(formData);
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
      <Tooltip color="success" content="Edit Details">
        <button
          className=""
          onClick={(event) => {
            setIsModalOpen(true);
          }}
        >
          <Edit className="h-5 w-5 text-green-500 hover:text-green-600" />
        </button>
      </Tooltip>
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
                Edit Individual
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col py-4  rounded-md  w-full">
                    <div className="flex flex-col md:flex-row  gap-4">
                      <Input
                        name="id"
                        className="hidden"
                        value={individual?.id}
                        readOnly
                      />
                      <div className="w-full">
                        <Input
                          isRequired
                          name="name"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Full Name"
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
                        <NumberInput
                          hideStepper
                          isRequired
                          name="idNumber"
                          className="outline-2 outline-blue-500 mb-4 "
                          label="ID Number"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={idNumber}
                          formatOptions={{ useGrouping: false }}
                          onValueChange={setIdNumber}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4 ">
                      <div className="w-full">
                        <Input
                          isRequired
                          name="phone"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Phone Number"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full">
                        <Select
                          isRequired
                          name="region"
                          className=""
                          label="Loanee Region"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectRegion]}
                          onChange={(e) => setRegion(e.target.value)}
                        >
                          {regions.map((region: any, index: any) => (
                            <SelectItem key={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <div className="w-full">
                        <Input
                          name="business"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Nature of Business"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={formData.business}
                          onChange={handleChange}
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
                          "Update"
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
