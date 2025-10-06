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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { updateStaff } from "@/app/lib/sun-actions";
import { EllipsisVertical, Trash, Edit } from "lucide-react";

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

export default function EditStaff({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "",
    status: user.status || "",
    password: user.password || "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [selectRole, setRole] = useState("");
  const [selectStatus, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await updateStaff(formData);

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
          className="pr-3"
          onClick={(event) => {
            setIsModalOpen(true);
          }}
        >
          <Edit className="h-4 w-4 text-green-500 hover:text-green-600" />
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
                Edit Staff Details
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col py-4  rounded-md  w-full">
                    <div className="flex flex-col md:flex-row  gap-4">
                      <div className="w-full">
                        <Input
                          className="hidden"
                          name="id"
                          value={user.id}
                          readOnly
                        />
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
                        <Input
                          isRequired
                          name="email"
                          type="email"
                          className="outline-2 outline-blue-500 mb-4 "
                          label="Email"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <div className="w-full">
                        <Input
                          name="phone"
                          type="text"
                          className="outline-2 outline-blue-500  "
                          label="Phones"
                          labelPlacement="outside"
                          color="success"
                          size="md"
                          variant="faded"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <div
                          id="customer-error"
                          aria-live="polite"
                          aria-atomic="true"
                        ></div>
                      </div>
                      <div className="w-full">
                        <Select
                          isRequired
                          name="role"
                          className=""
                          label="Select staff role"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectRole]}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          {roles.map((role: any, index: any) => (
                            <SelectItem key={role.key}>{role.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                      <div className="w-full">
                        <Select
                          isRequired
                          name="status"
                          className=""
                          label="Select staff status"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectStatus]}
                          onChange={(e) =>
                            setStatus(e.target.validationMessage)
                          }
                        >
                          {status.map((item: any, index: any) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="w-full">
                        <Input
                          name="password"
                          type={isVisible ? "text" : "password"}
                          className="outline-2 outline-blue-500 mb-4 "
                          label="Password"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          endContent={
                            <button
                              aria-label="toggle password visibility"
                              className="focus:outline-solid outline-transparent"
                              type="button"
                              onClick={toggleVisibility}
                            >
                              {isVisible ? (
                                <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                              ) : (
                                <EyeIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </button>
                          }
                          value={formData.password}
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
                          "Edit"
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
