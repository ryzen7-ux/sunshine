"use client";

import {
  Form,
  Input,
  Button,
  Spinner,
  addToast,
  NumberInput,
} from "@heroui/react";
import { updateMember, MembersState } from "@/app/lib/sun-actions";
import { useState } from "react";

export default function EditMemberForm({
  member,
  onClose,
}: {
  member: any;
  onClose: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateMember(formData);

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
    <>
      <Form onSubmit={handleSubmit}>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="hidden" name="id" value={member.id} readOnly />
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
                defaultValue={member.idnumber}
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
                className="outline-2 outline-blue-500  "
                label="First Name"
                color="success"
                labelPlacement="outside"
                size="md"
                variant="faded"
                defaultValue={member.firstname}
              />
              <div
                id="customer-error"
                aria-live="polite"
                aria-atomic="true"
              ></div>
            </div>
            <div className="w-full">
              <Input
                isRequired
                name="phone"
                type="text"
                className="outline-2 outline-blue-500  "
                label="Phone Number"
                labelPlacement="outside"
                color="success"
                size="md"
                variant="faded"
                defaultValue={member.phone}
              />
              <div
                id="customer-error"
                aria-live="polite"
                aria-atomic="true"
              ></div>
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
                defaultValue={member.location}
              />
              <div
                id="customer-error"
                aria-live="polite"
                aria-atomic="true"
              ></div>
            </div>
            <div className="w-full col-span-2">
              <Input
                name="nature"
                type="text"
                className="outline-2 outline-blue-500  "
                label="Nature of Business"
                labelPlacement="outside"
                color="success"
                size="md"
                variant="faded"
                defaultValue={member.nature}
              />
              <div
                id="customer-error"
                aria-live="polite"
                aria-atomic="true"
              ></div>
            </div>
          </div>
          {/*File Input*/}
          <div className=" hidden">
            <div className="flex flex-col md:flex-row mt-4 gap-4 ">
              <div className="w-full  col-span-4 pb-4">
                {/* <label>
                  <span>Upload ID front:</span>
                  <input type="file" name="id_front" className="px-2" />
                  <input
                    type="text"
                    name="id_front_name"
                    defaultValue={member.id_front}
                    className="hidden"
                  />
                </label> */}
                <input
                  type="text"
                  name="id_front_name"
                  defaultValue={member.id_front}
                  className="hidden"
                />
                <label className="text-sm text-green-500 ">
                  Choose ID Front
                </label>
                <input
                  type="file"
                  name="id_front"
                  id="file-input"
                  className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-green-200 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400"
                ></input>
              </div>
              <div className="w-full ">
                {/* <label>
                  <span>Upload ID back:</span>
                  <input type="file" name="id_back" className="pl-2" />
                  <input
                    type="text"
                    name="id_back_name"
                    defaultValue={member.id_back}
                    className="hidden"
                  />
                </label> */}
                <input
                  type="text"
                  name="id_back_name"
                  defaultValue={member.id_back}
                  className="hidden"
                />
                <label className="text-sm text-green-500 ">
                  Choose ID Back
                </label>
                <input
                  type="file"
                  name="id_back"
                  id="file-input"
                  className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-green-200 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400"
                ></input>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 ">
              <div className="w-full ">
                {/* <label>
                  <span>Upload passport:</span>
                  <input type="file" name="passport" className="pl-2" />
                  <input
                    type="text"
                    name="passport_name"
                    defaultValue={member.passport}
                    className="hidden"
                  />
                </label> */}
                <input
                  type="text"
                  name="passport_name"
                  defaultValue={member.passport}
                  className="hidden"
                />
                <label className="text-sm text-green-500 ">
                  Choose Passport
                </label>
                <input
                  type="file"
                  name="passport"
                  id="file-input"
                  className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-green-200 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400"
                ></input>
              </div>
              <div className="w-full ">
                {/* <label>
                  <span>Application form:</span>
                  <input type="file" name="doc" className="pl-2" />
                  <input
                    type="text"
                    name="doc_name"
                    defaultValue={member.doc}
                    className="hidden"
                  />
                </label>
                                                <label className="text-sm text-green-500 ">
                  Choose Application Form (PDF)
                </label> */}
                <input
                  type="text"
                  name="doc_name"
                  defaultValue={member.doc}
                  className="hidden"
                />
                <label className="text-sm text-green-500 ">
                  Choose Application Form (PDF)
                </label>
                <input
                  type="file"
                  name="doc"
                  id="file-input"
                  className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-green-200 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400"
                ></input>
              </div>
            </div>
          </div>
          <Input
            className="hidden"
            name="groupId"
            type="text"
            defaultValue={member.groupid}
            readOnly
          />

          <div className="my-6 py-6">
            <Button
              type="submit"
              color="success"
              className="w-full"
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner color="default" /> : "Edit"}
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
