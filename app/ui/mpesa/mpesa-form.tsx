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
  Divider,
  DatePicker,
} from "@heroui/react";
import { Button } from "@heroui/react";
import { createMpesaInvoice } from "@/app/lib/sun-actions";
import {
  now,
  getLocalTimeZone,
  parseZonedDateTime,
} from "@internationalized/date";

export default function AddMpesaForm({ onClose }: { onClose: any }) {
  const [isLoading, setIsloading] = useState(false);
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [transId, setTransId] = useState("");
  const [amount, setAmount] = useState<any>();
  const [name, setName] = useState<any>("");
  const [transDate, setTransDate] = useState<any>(now(getLocalTimeZone()));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await createMpesaInvoice(formData);

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
      onClose();
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col   rounded-md  w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <Input
                isRequired
                name="group"
                type="text"
                className="outline-2 outline-blue-500  "
                label="Group Name/ ID Number"
                labelPlacement="outside"
                placeholder=""
                color="success"
                size="md"
                variant="faded"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                isRequired
                name="phone"
                type="text"
                className="outline-2 outline-blue-500  "
                label="Phone Number"
                labelPlacement="outside"
                placeholder=""
                color="success"
                size="md"
                variant="faded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 ">
            <div className="w-full">
              <Input
                isRequired
                name="transId"
                type="text"
                className="outline-2 outline-blue-500  "
                label="Transaction ID"
                labelPlacement="outside"
                placeholder=""
                color="success"
                size="md"
                variant="faded"
                value={transId}
                onChange={(e) => setTransId(e.target.value)}
                description="eg : TIQ0706QH8"
              />
            </div>
            <div className="w-full">
              <NumberInput
                isRequired
                name="amount"
                className="outline-2 outline-blue-500 "
                label="Amount"
                color="success"
                labelPlacement="outside"
                size="md"
                variant="faded"
                value={amount}
                onValueChange={(e) => setAmount(e)}
                formatOptions={{ useGrouping: false }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">Ksh</span>
                  </div>
                }
              />
            </div>
          </div>
          <div className="w-full pb-4">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              inert={false}
            />
          </div>
          <DatePicker
            isRequired
            errorMessage="Select loan term first"
            showMonthAndYearPickers
            name="transDate"
            className="pb-4"
            variant="faded"
            color="success"
            label="Transaction Date and Time"
            size="md"
            labelPlacement="outside"
            value={transDate}
            onChange={(val) => {
              setTransDate(val);
            }}
            inert={false}
          />

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
                "Add Transaction"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
