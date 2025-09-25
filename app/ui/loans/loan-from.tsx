"use client";

import React from "react";
import { GroupsTable, MemberForm } from "@/app/lib/sun-defination";
import { Input, Divider, Select, SelectItem } from "@heroui/react";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/solid";
import { Button } from "@/app/ui/button";
import { createLoan, LoanState } from "@/app/lib/sun-actions";
import { useActionState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";

export default function CreateLoanForm({
  groups,
  members,
}: {
  groups: GroupsTable[];
  members: MemberForm[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const [select, setSelect] = React.useState("");
  const [selectMember, setSelectMember] = React.useState("");

  const [amount, setAmount] = React.useState("");
  const [interest, setInterest] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [weeklyPayment, setWeeklyPayment] = React.useState(0);
  const [loanId, setLoanId] = React.useState("");

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

  const [state, formAction, isLoading] = useActionState(
    createLoan,
    initialState
  );

  return (
    <form
      action={formAction}
      className="px-4 py-4 md:px-12 border md:rounded-lg py-12 mb-12"
    >
      <div className="flex gap-4 pb-2">
        <div className="w-full">
          <Select
            isRequired
            name="group_id"
            className=""
            label="Select a group"
            variant="faded"
            size="md"
            color="primary"
            startContent={<UserGroupIcon className="h-6 w-6 fill-blue-500" />}
            labelPlacement="outside"
            selectedKeys={[select]}
            onChange={(e) => {
              setSelect(e.target.value);
              handleSearch(e.target.value);
              setSelectMember("");
            }}
          >
            {groups.map((group: any) => (
              <SelectItem key={group.id}>{group.name}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full">
          <Select
            title="foo"
            name="member_id"
            isRequired
            className=""
            label="Select Member"
            size="md"
            color="primary"
            variant="faded"
            selectedKeys={[selectMember]}
            startContent={<UserIcon className="h-6 w-6 fill-blue-500" />}
            labelPlacement="outside"
            onChange={(e) => {
              setSelectMember(e.target.value);
            }}
          >
            {members?.map((member) => (
              <SelectItem key={member.id}>{member.name}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-row gap-4 ">
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
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 py-2">
        <div className="w-full">
          <Input
            color="primary"
            isRequired
            name="interest"
            type="number"
            className="outline-2 outline-blue-500  "
            label="Interest Rate (%)"
            description="NB: This is interest per month"
            labelPlacement="outside"
            size="md"
            variant="faded"
            defaultValue={interest}
            onChange={(e: any) => setInterest(e.target.value)}
          />
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.interest &&
              state.errors.interest.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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
          <div id="term-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.term &&
              state.errors.term.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 block text-sm font-medium">
          Set the loan status
        </legend>
        <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                id="pending"
                name="status"
                type="radio"
                defaultValue="pending"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                readOnly
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
                defaultValue="approved"
                className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                readOnly
              />
              <label
                htmlFor="paid"
                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                Approved <CheckIcon className="h-4 w-4" />
              </label>
            </div>
          </div>
          <input className="hidden" name="group_id" value={select} />
        </div>
        <div id="status-error" aria-live="polite" aria-atomic="true">
          {state?.errors?.status &&
            state.errors.status.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </fieldset>
      <div className="py-2">
        <p className="text-xl py-2">Loan Summary</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Loan Amount:</span>
            <span className="font-medium">
              {formatCurrencyToLocal(principal || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              Interest Rate (Per Month):
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
              {formatCurrencyToLocal(wpay || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Payment:</span>
            <span className="font-bold text-lg">
              {" "}
              {formatCurrencyToLocal(payment || 0)}
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
