//@ts-nocheck
"use client";

import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  NumberInput,
  Checkbox,
  Chip,
  Radio,
  RadioGroup,
} from "@heroui/react";
import {
  BanknotesIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";
import {
  DateValue,
  getLocalTimeZone,
  today,
  now,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { createInvoice, State } from "@/app/lib/pos-actions";
import { useActionState } from "react";

export default function ModalFormComponent({
  list,
  index,
}: {
  list?: any;
  index: number;
}) {
  let defaultDate = today(getLocalTimeZone());
  let invoceNumber = `INV-${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}-${String(
    Math.floor(1000 + Math.random() * 9000)
  )}`;

  const [value, setValue] = React.useState<DateValue | null>(defaultDate);

  const [quantityValue, setQuantityValue] = React.useState(1);
  const [priceValue, setPriceValue] = React.useState(list[index].price);
  const [taxValue, setTaxValue] = React.useState(0);

  const subtotal = quantityValue * priceValue;
  const taxAmount = subtotal * (taxValue / 100);
  const total = subtotal + taxAmount;

  const initialState: State = { message: null, errors: {} };

  const [state, formAction, isLoading] = useActionState(
    createInvoice,
    initialState
  );

  return (
    <Form action={formAction}>
      <Input
        name="name"
        type="text"
        className="invisible"
        value={list[index].title}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          isReadOnly
          name="invoiceNumber"
          className="col-span-1"
          label="Invoice Number"
          labelPlacement="outside"
          type="text"
          color="secondary"
          placeholder="Invoice Number"
          value={invoceNumber}
        />

        <DatePicker
          isReadOnly
          name="date"
          className="col-span-1"
          label="Date"
          labelPlacement="outside"
          color="secondary"
          value={value}
          onChange={setValue}
        />

        <NumberInput
          name="quantity"
          isWheelDisabled
          className="col-span-1"
          label="Quantity"
          color="secondary"
          labelPlacement="outside"
          value={quantityValue ?? 1}
          onChange={(e: any) => setQuantityValue(e.target.value)}
          type="number"
        />

        {state.errors?.quantity &&
          state.errors.quantity.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}

        <NumberInput
          name="price"
          isReadOnly
          className="col-span-1"
          label="Price"
          labelPlacement="outside"
          color="secondary"
          value={priceValue}
          onChange={(e: any) => setPriceValue(e.target.value)}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Ksh</span>
            </div>
          }
          type="text"
        />
      </div>
      <div>
        {state.errors?.price &&
          state.errors.price.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <div className="flex justify-between w-full py-4">
        <NumberInput
          name="tax"
          className="w-24"
          label="Tax Rate (%)"
          color="secondary"
          labelPlacement="outside"
          value={taxValue}
          onChange={(e: any) => setTaxValue(e.target.value)}
          type="number"
        />
        <div>
          <div className="text-sm">Subtotal: Ksh {subtotal.toFixed(2)}</div>
          <div className="text-sm">Tax: Ksh {taxAmount.toFixed(2)}</div>
          <div className="text-lg font-bold">Total: Ksh {total.toFixed(2)}</div>
        </div>
      </div>
      <div>
        {state.errors?.tax &&
          state.errors.tax.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>

      <div className="flex w-full gap-6 py-4">
        <div className="flex gap-4 items-center justify-center">
          <input
            id="pending"
            name="payment"
            type="radio"
            value="cash"
            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
          />
          <Chip
            className="p-4"
            size="md"
            color="primary"
            endContent={<BanknotesIcon className="h-4 w-4" />}
            variant="shadow"
          >
            Cash
          </Chip>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <input
            id="pending"
            name="payment"
            type="radio"
            value="mpesa"
            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
          />
          <Chip
            className="p-4"
            size="md"
            color="success"
            endContent={<DevicePhoneMobileIcon className="h-4 w-4" />}
            variant="shadow"
          >
            Mpesa
          </Chip>
        </div>
        <div>
          {state.errors?.payment &&
            state.errors.payment.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div className="flex flex-col  items-end w-full py-4">
        {isLoading ? (
          <Button
            className="px-4"
            type="submit"
            color="primary"
            isLoading
            disabled={isLoading}
          >
            Processing
          </Button>
        ) : (
          <Button className="px-12" type="submit" color="primary">
            Create Invoice
          </Button>
        )}
      </div>
    </Form>
  );
}
