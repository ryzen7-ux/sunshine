//@ts-nocheck
"use client";

import { Form, Input, Button, Spinner, addToast } from "@heroui/react";
import { useActionState } from "react";
import { createMembers, MembersState } from "@/app/lib/sun-actions";
import React from "react";
import { useAppContext } from "@/app/app-context";

export default function MemberForm({
  groupId,
  setIsSuccess,
}: {
  groupId: string;
  setIsSuccess: any;
}) {
  const initialState: MembersState = { message: null, errors: {} };
  const [state, formAction, isLoading] = useActionState(
    createMembers,
    initialState
  );
  const { success, handleSuccess } = useAppContext();

  return (
    <Form action={formAction}>
      <h1 className="text-xl font-bold text-gray-900  ">Add Member</h1>
      <div className="flex flex-col py-4 border rounded-md px-6 w-full">
        <div className="flex flex-col md:flex-row  gap-4">
          <div className="w-full">
            <Input
              isRequired
              name="idNumber"
              type="text"
              className="outline-2 outline-blue-500  "
              label="ID number"
              labelPlacement="outside"
              color="success"
              size="md"
              variant="faded"
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.idNumber &&
                state.errors.idNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
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
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.surname &&
                state.errors.surname.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="w-full">
            <Input
              isRequired
              name="firstName"
              type="text"
              className="outline-2 outline-blue-500 mb-4 "
              label="First name"
              color="success"
              labelPlacement="outside"
              size="md"
              variant="faded"
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstName &&
                state.errors.firstName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 ">
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
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
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
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.location &&
                state.errors.location.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="w-full">
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
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.location &&
                state.errors.location.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
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
            onPress={handleSuccess}
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
