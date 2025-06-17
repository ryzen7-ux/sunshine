//@ts-nocheck
"use client";

import { Form, Input, Button, Spinner, addToast } from "@heroui/react";
import { useActionState } from "react";
import {
  createGroup,
  updateGroup,
  State,
  updateMember,
  MembersState,
} from "@/app/lib/sun-actions";
import React from "react";
import { useAppContext } from "@/app/app-context";
import { MemberForm } from "@/app/lib/sun-defination";

export default function EditMemberForm({
  setIsSuccess,
  member,
}: {
  setIsSuccess: boolean;
  member: MemberForm;
}) {
  const initialState: MembersState = { message: null, errors: {} };

  const { success, handleSuccess } = useAppContext();
  const updateMemberWithId = updateMember.bind(null, member.id);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 mb-2 ">
        Edit Member Details
      </h1>
      <Form action={updateMemberWithId}>
        <div className="flex flex-col py-4 border rounded-md px-6 w-full">
          <div className="flex flex-col md:flex-row  gap-4">
            <div className="w-full">
              <Input
                isRequired
                name="idNumber"
                type="number"
                className="outline-2 outline-blue-500  "
                label="ID Number"
                labelPlacement="outside"
                color="success"
                size="md"
                variant="faded"
                defaultValue={member.idnumber}
              />
              <div
                id="customer-error"
                aria-live="polite"
                aria-atomic="true"
              ></div>
            </div>
            {/* <div class="relative flex w-full max-w-sm flex-col gap-1 text-on-surface dark:text-on-surface-dark">
    <label for="fileInput" class="w-fit pl-0.5 text-sm">Upload File</label>
    <input id="fileInput" type="file" class="w-full max-w-md overflow-clip rounded-radius border border-outline bg-surface-alt/50 text-sm file:mr-4 file:border-none file:bg-surface-alt file:px-4 file:py-2 file:font-medium file:text-on-surface-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-75 dark:border-outline-dark dark:bg-surface-dark-alt/50 dark:file:bg-surface-dark-alt dark:file:text-on-surface-dark-strong dark:focus-visible:outline-primary-dark" />
    <small class="pl-0.5">PNG, JPG, WebP - Max 5MB</small>
</div> */}
            <div className="w-full">
              <Input
                isRequired
                name="surname"
                type="text"
                className="outline-2 outline-blue-500 mb-4 "
                label="Surname"
                color="success"
                labelPlacement="outside"
                size="md"
                variant="faded"
                defaultValue={member.surname}
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
                name="firstName"
                type="text"
                className="outline-2 outline-blue-500 mb-4 "
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
          </div>
          <div className="flex flex-col md:flex-row gap-4 ">
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
            <div className="w-full">
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
          <div className=" ">
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
          />

          <div className="my-6 py-6">
            <Button
              type="submit"
              color="success"
              className="w-full"
              onPress={handleSuccess}
            >
              Edit
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
