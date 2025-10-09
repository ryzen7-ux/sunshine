import {
  CheckIcon,
  ClockIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function InvoiceStatus({ status }: { status: string }) {
  const statusClass = clsx({
    "inline-flex items-center rounded-full px-2 py-1 text-xs": true, // Always applies the base class
    "bg-yellow-200 text-gray-600": status === "pending",
    "bg-green-500 text-white": status === "approved",
    "bg-pink-500 text-white": status === "inactive",
    "bg-cyan-500  text-white": status === "defered",
    "bg-red-500  text-white": status === "rejected",
  });
  return (
    <span className={statusClass}>
      {status === "pending" ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-800" />
        </>
      ) : null}
      {status === "approved" ? (
        <>
          Active
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "inactive" ? (
        <>
          Inactive
          <ShieldExclamationIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "defered" ? (
        <>
          Defered
          <CalendarDaysIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "rejected" ? (
        <>
          Rejected
          <XCircleIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
