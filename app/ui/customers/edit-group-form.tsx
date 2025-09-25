"use client";

import { Form, Input, Button, Spinner, addToast } from "@heroui/react";
import { useActionState } from "react";
import { createGroup, updateGroup, State } from "@/app/lib/sun-actions";
import React from "react";
import { GroupForm } from "@/app/lib/sun-defination";

export default function EditGroupForm({
  setIsSuccess,
  group,
}: {
  setIsSuccess: any;
  group: GroupForm;
}) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isLoading] = useActionState(
    createGroup,
    initialState
  );

  const updateGroupWithId = updateGroup.bind(null, group.id);

  return (
    <Form action={updateGroupWithId}>
      <div className="flex flex-col py-4 border rounded-md px-6 w-full">
        <div className="flex flex-col md:flex-row  gap-4">
          <div className="w-full">
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
              defaultValue={group.reg}
              variant="faded"
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.reg &&
                state.errors.reg.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
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
              defaultValue={group.name}
              variant="faded"
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
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
              name="location"
              type="text"
              className="outline-2 outline-blue-500  "
              label="Location"
              labelPlacement="outside"
              color="success"
              size="md"
              defaultValue={group.location}
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
          {/* <div className="w-full">
            <Input
              isRequired
              name="disbursed"
              className="outline-2 outline-blue-500 "
              label="Amount disbursed"
              color="success"
              labelPlacement="outside"
              size="md"
              type="number"
              step="0.01"
              defaultValue={group.disbursed}
              variant="faded"
            />
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.disbursed &&
                state.errors.disbursed.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div> */}
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
              "Edit Group"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
