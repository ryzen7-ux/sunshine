"use client";

import {
  Form,
  Input,
  Button,
  Spinner,
  addToast,
  NumberInput,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { createMembers, MembersState } from "@/app/lib/sun-actions";
import React from "react";

export default function MemberForm({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ isError: false, type: "", message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createMembers(formData);

    if (res?.success === false) {
      setIsLoading(false);
      if (res?.success == false) {
        addToast({
          title: "Error !",
          description: res.message,
          color: "danger",
        });
      } else {
        setIsLoading(false);
        addToast({
          title: "Error !",
          description: res?.message,
          color: "danger",
        });
      }
    }

    if (res?.success === true) {
      addToast({
        title: "Success !",
        description: res?.message,
        color: "success",
      });
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex flex-col  w-full">
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          <div className="w-full">
            <NumberInput
              isRequired
              name="idNumber"
              className="outline-2 outline-blue-500 "
              label="ID Number"
              color="success"
              labelPlacement="outside"
              size="md"
              variant="faded"
              placeholder="0"
              formatOptions={{ useGrouping: false }}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small"></span>
                </div>
              }
            />
          </div>
          <div className="w-full">
            <Input
              isRequired
              name="firstName"
              type="text"
              className="outline-2 outline-blue-500"
              label="Name"
              color="success"
              labelPlacement="outside"
              size="md"
              variant="faded"
            />
          </div>
          <div className="w-full">
            <Input
              isRequired
              name="phone"
              type="text"
              className="outline-2 outline-blue-500  "
              label="Phone number"
              labelPlacement="outside"
              color="success"
              size="md"
              variant="faded"
            />
          </div>
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
            />
          </div>
          <div className="w-full col-span-1 md:col-span-2">
            <Input
              name="nature"
              type="text"
              className="outline-2 outline-blue-500  "
              label="Nature of business"
              labelPlacement="outside"
              color="success"
              size="md"
              variant="faded"
            />
          </div>
        </div>

        <Input
          className="hidden"
          name="groupId"
          type="text"
          defaultValue={groupId}
        />
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
              "Add Member"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
