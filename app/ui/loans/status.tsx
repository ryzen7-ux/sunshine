import {
  CheckIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function InvoiceStatus({ status }: { status: string }) {
  const statusClass = clsx({
    "inline-flex items-center rounded-full px-2 py-1 text-xs": true, // Always applies the base class
    "bg-yellow-100 text-yellow-500": status === "pending",
    "bg-green-500 text-white": status === "approved",
    "bg-red-500 text-white": status === "inactive",
  });
  return (
    <span className={statusClass}>
      {status === "pending" ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-yellow-500" />
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
    </span>
  );
}
