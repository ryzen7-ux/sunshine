//@ts-nocheck

"use client";

import React from "react";
import { LoanForm } from "@/app/lib/sun-defination";
import { Input, Divider, DatePicker, Textarea } from "@heroui/react";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateLoan, LoanState } from "@/app/lib/sun-actions";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";
import { now, getLocalTimeZone } from "@internationalized/date";

export default function EditLoanForm({ loan }: { loan: LoanForm }) {
  const [amount, setAmount] = React.useState(loan.amount.toString());
  const [interest, setInterest] = React.useState(loan.interest.toString());
  const [term, setTerm] = React.useState(loan.term.toString());
  const [weeklyPayment, setWeeklyPayment] = React.useState(0);
  const [startDate, setStartDate] = React.useState(now(getLocalTimeZone()));

  const principal = Number.parseFloat(amount);
  const rate = Number.parseFloat(interest) / 100 / 4;
  const Loanterm = Number.parseInt(term);

  const wpay = Math.ceil(principal / Loanterm + principal * rate);
  const payment = Math.ceil(wpay * Loanterm);

  const calculateWeeklyPayment = () => {
    const principal = Number.parseFloat(amount);
    const rate = Number.parseFloat(interest) / 100 / 12;
    const Loanterm = Number.parseInt(term);

    if (principal && rate && term) {
      const payment =
        (principal * rate * Math.pow(1 + rate, Loanterm)) /
        (Math.pow(1 + rate, Loanterm) - 1);
      setWeeklyPayment(Math.round(payment * 100) / 100);
    }
  };
  const initialState: LoanState = { message: null, errors: {} };
  const updateLoanWithId = updateLoan.bind(null, loan.id);

  return (
    <form
      action={updateLoanWithId}
      className="px-4 py-4 md:px-12 border md:rounded-lg py-12 mb-12"
    >
      <div className="flex gap-4  mb-2 items-center px-4 py-2 border rounded-lg bg-blue-100 ">
        <p>
          <strong>Borrower:</strong>{" "}
          <span className="text-xs">
            {loan.firstname} {loan.surname}
          </span>
        </p>
        <p className="">
          <strong>ID number:</strong>{" "}
          <span className="text-sm">{loan.idnumber}</span>
        </p>
      </div>
      <div className="mb-2 w-full flex items-center justify-center">
        <p>
          <strong>Loan Created on: {formatDateToLocal(loan.date)}</strong>
        </p>
      </div>
      <div className="flex flex-row gap-2 ">
        <div className="w-full ">
          <Input
            color="primary"
            isRequired
            name="amount"
            type="number"
            className="outline-2 outline-blue-500  "
            label="Loan Amount"
            labelPlacement="outside"
            size="md"
            variant="faded"
            defaultValue={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          {/* <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>
        <div className="w-full">
          <Input
            color="primary"
            name="loan_id"
            type="text"
            className="outline-2 outline-blue-500  "
            label="Loan ID"
            labelPlacement="outside"
            size="md"
            variant="faded"
            defaultValue={loan.loanid}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 py-2">
        <div className="w-full">
          <Input
            color="primary"
            isRequired
            name="interest"
            type="number"
            className="outline-2 outline-blue-500  "
            label="Interest Rate (%)"
            description="NB: This is interest rate per month"
            labelPlacement="outside"
            size="md"
            variant="faded"
            defaultValue={interest}
            onChange={(e: any) => setInterest(e.target.value)}
          />
          {/* <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.interest &&
              state.errors.interest.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>
        <div className="w-full">
          <Input
            color="primary"
            isRequired
            name="term"
            type="number"
            className="outline-2 outline-blue-500  "
            label="Loan Term (Weeks)"
            labelPlacement="outside"
            size="md"
            variant="faded"
            defaultValue={term}
            onChange={(e: any) => setTerm(e.target.value)}
          />
          {/* <div id="term-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.term &&
              state.errors.term.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>
      </div>
      <DatePicker
        showMonthAndYearPickers
        name="start_date"
        className="pb-4"
        variant="faded"
        color="primary"
        label="Loan Start Date"
        size="md"
        labelPlacement="outside"
        defaultValue={startDate}
        onChange={(e: any) => setStartDate(e.target.value)}
      />
      {/* Loans status fields */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium">
          Set the loan status
        </legend>
        <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex flex-row gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  defaultChecked={loan.status === "pending"}
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-200 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="approved"
                  name="status"
                  type="radio"
                  value="approved"
                  className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                  defaultChecked={loan.status === "approved"}
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Approved <CheckIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="defered"
                  name="status"
                  type="radio"
                  value="defered"
                  className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                  defaultChecked={loan.status === "defered"}
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Defered <CalendarDaysIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="rejected"
                  name="status"
                  type="radio"
                  value="rejected"
                  className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                  defaultChecked={loan.status === "rejected"}
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Rejected <XCircleIcon className="h-4 w-4" />
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="approved"
                  name="status"
                  type="radio"
                  value="inactive"
                  className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                  defaultChecked={loan.status === "inactive"}
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Inactive <ShieldExclamationIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div id="status-error" aria-live="polite" aria-atomic="true">
          {/* {state?.errors?.status &&
            state.errors.status.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))} */}
        </div>
      </fieldset>
      <div className="py-4">
        <Textarea
          name="notes"
          isClearable
          className="max-w"
          label="Notes"
          placeholder="Enter your Notes"
          variant="faded"
          color="primary"
          size="md"
          defaultValue={loan?.notes}
        />
      </div>
      <div className="py-2">
        <p className="text-xl py-2">Loan Summary</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Loan Amount:</span>
            <span className="font-medium">
              {formatCurrencyToLocal(principal || 0.0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              Interest Rate (Per month):
            </span>
            <span className="font-medium">{interest || "0"}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Term:</span>
            <span className="font-medium">{term || "0"} Weeks</span>
          </div>
          <Divider />
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Weekly Payment:</span>
            <span className="font-bold text-lg">
              {" "}
              {formatCurrencyToLocal(wpay || 0.0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Payment:</span>
            <span className="font-bold text-lg">
              {" "}
              {formatCurrencyToLocal(payment || 0.0)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div></div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" color="success">
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
