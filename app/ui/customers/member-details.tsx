"use client";

import { Divider, Avatar, Progress } from "@heroui/react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { Camera } from "lucide-react";
import { MemberForm, LoanForm } from "@/app/lib/sun-defination";
import InvoiceStatus from "@/app/ui/loans/status";
import { formatDateToLocal, formatCurrencyToLocal } from "@/app/lib/utils";

export default function MemberDetails({
  memberData,
  loan,
}: {
  memberData: MemberForm;
  loan: LoanForm;
}) {
  const principal = loan?.amount || 0;
  const loanterm = loan?.term || 0;
  const rate = loan?.interest || 0;
  const newrate = rate / 100 / 4;

  const wpay = Math.ceil(principal / loanterm + principal * newrate);
  const payment = Math.ceil(wpay * loanterm);
  const loan_today = loan?.today || 0;
  const today = Math.floor((loan_today * 100) / loanterm);
  const today_date = new Date();
  const past_days = loan?.past_days || 0;
  const remaining_days = loanterm * 7 - past_days;

  return (
    <div className="w-full flex flex-col md:flex-row py-4 gap-4">
      <div className="w-full flex gap-3 pb-4 border rounded-lg bg-gray-100 py-4 px-4">
        <Avatar
          className="w-40 h-40 text-large mb-auto"
          src="data:image/png;base64,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"
        />
        <div className="flex flex-col pt-8">
          <p className="text-md text-default-900 ">
            Name: {memberData.firstname} {memberData.surname}
          </p>
          <p className="pt-1 text-sm text-default-600 ">
            ID number: {memberData.idnumber}
          </p>
          <p className="pt-1 text-sm text-default-600 pt-1">
            Location: {memberData.location}
          </p>

          <p className="flex text-small text-default-500 p-1">
            <span>
              <PhoneIcon className="w-5 " />
            </span>
            <span className="pl-1">{memberData.phone}</span>
          </p>
        </div>
      </div>

      <div className="border rounded-lg bg-gray-100 pl-4">
        <div>
          <div className="flex justify-between ">
            <h1 className="text-xl font-bold text-gray-900 py-4 ">
              Latest Loan Details
            </h1>
            <div className="p-4">
              <InvoiceStatus status={loan?.status || "No loan"} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex gap-4">
            <div className="flex flex-col w-48 md:w-36">
              <p className="text-sm text-default-600">Amount</p>
              <p className="text-lg font-bold text-default-900">
                {formatCurrencyToLocal(loan?.amount || 0.0)}
              </p>
            </div>
            <div className="w-24 md:w-32"></div>
            <div className="flex flex-col jutify-center w-48 md:w-36">
              <p className="text-sm text-default-600">Interest</p>
              <p className="text-lg font-bold text-default-900">
                {loan?.interest || "0"} %
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <div className="flex flex-col w-48 md:w-36">
              <p className="text-sm text-default-600">Duration</p>
              <p className="text-lg font-bold text-default-900">
                {loan?.term || "0"} Weeks
              </p>
            </div>
            <div className="w-24 md:w-32"></div>
            <div className="flex flex-col justify-center w-48 md:w-36">
              <p className="text-sm text-default-600">Weekly Installment</p>
              <p className="text-lg font-bold text-default-900">
                {formatCurrencyToLocal(wpay || 0.0)}
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <div className="flex flex-col w-48 md:w-36">
              <p className="text-sm text-default-600">Total Amount (P+I)</p>
              <p className="text-lg font-bold text-default-900">
                {formatCurrencyToLocal(payment || 0.0)}
              </p>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex gap-4">
            <div className="flex flex-col w-48 md:w-36">
              <p className="text-sm text-default-600">Loan Start Date</p>
              <p className="text-lg font-bold text-default-900">
                {loan?.start_date ? formatDateToLocal(loan?.start_date) : "Nil"}
              </p>
            </div>
            <div className="w-24 md:w-32"></div>
            <div className="flex flex-col jutify-center w-48 md:w-36">
              <p className="text-sm text-default-600">Loan End Date</p>
              <p className="text-lg font-bold text-default-900">
                {loan?.end_date ? formatDateToLocal(loan?.end_date) : "Nil"}
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Progress
              aria-label="Loading..."
              className="max-w-md"
              label={`Today: ${today_date.toDateString()} ( ${
                (loan?.status === "approved" && remaining_days) || 0
              } Remaining days)`}
              value={today}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
