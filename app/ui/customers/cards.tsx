import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  ScaleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import { fectchGroupCardData } from "@/app/lib/sun-data";

const iconMap = {
  disbursed: ScaleIcon,
  collected: BanknotesIcon,
  customers: UsersIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();

  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}
      <Card
        title="Disbursed"
        value="Ksh 0"
        type="disbursed"
        color="text-blue-800"
        span=""
      />
      <Card
        title="Collected"
        value={`Ksh 0`}
        type="collected"
        color="text-green-800"
        span=""
      />
      <Card
        title="Active oans"
        value={`Ksh 0`}
        type="pending"
        color="text-yellow-800"
        span=""
      />
      <Card
        title="Total Invoices"
        value={0}
        type="invoices"
        color="text-indigo-800"
        span=""
      />
      <Card
        title="Total Members"
        value={0}
        type="customers"
        color="text-pink-800"
        span="col-span-2 md:col-span-1"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
  color,
  span,
}: {
  title: string;
  value: number | string;
  type: "disbursed" | "invoices" | "customers" | "pending" | "collected";
  color: string;
  span: string;
}) {
  const Icon = iconMap[type];

  return (
    <div className={`ring-2 ring-green-700 rounded-xl bg-gray-50  ${span}`}>
      <div className="flex p-4">
        {Icon ? <Icon className={`h-6 w-6 ${color}`} /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-b-xl bg-white px-4 py-2 text-center text-gray-600 text-lg font-black`}
      >
        {value}
      </p>
    </div>
  );
}
