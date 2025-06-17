"use client";

import { Form, Input, Button, Spinner, addToast } from "@heroui/react";
import { useActionState } from "react";
import { createGroup, State } from "@/app/lib/sun-actions";
import React from "react";
import { useAppContext } from "@/app/app-context";

export default function GroupForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isLoading] = useActionState(
    createGroup,
    initialState
  );

  return (
    <Form action={formAction}>
      <div className="flex flex-col py-4 border rounded-md px-6 w-full">
        <div className="flex w-full items-center">
          <h1 className={`text-xl font-bold text-gray-900`}>Create Group</h1>
        </div>
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
              "Create Group"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
