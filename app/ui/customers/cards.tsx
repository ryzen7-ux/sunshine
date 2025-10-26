import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  ScaleIcon,
  UsersIcon,
  CircleStackIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/solid";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import { fectchGroupCardData, fetchGroupCardData } from "@/app/lib/sun-data";

const iconMap = {
  disbursed: ScaleIcon,
  collected: BanknotesIcon,
  pending: ClockIcon,
  totalLoan: CircleStackIcon,
  loanBalance: DocumentChartBarIcon,
  total: UsersIcon,
};

export default async function CardWrapper({
  groupDisbusredAmount,
  totalPayment,
  totalMembers,
  balance,
  totalMpesa,
}: {
  groupDisbusredAmount: any;
  totalPayment: any;
  totalMembers: any;
  balance: any;
  totalMpesa: any;
}) {
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}
      <Card
        title="Disbursed"
        value={groupDisbusredAmount}
        type="disbursed"
        color="text-blue-800"
        span=""
      />
      <Card
        title="Collected"
        value={totalMpesa}
        type="collected"
        color="text-green-800"
        span=""
      />
      <Card
        title="Total Loans"
        value={totalPayment}
        type="totalLoan"
        color="text-pink-800"
        span=""
      />
      <Card
        title="Loan Balance"
        value={balance}
        type="loanBalance"
        color="text-cyan-800"
        span="col-span-1 md:col-span-2"
      />
      {/* <Card
        title="Pending Payments"
        value={groupPendingPayments}
        type="pending"
        color="text-yellow-800"
        span="col-span-1 md:col-span-2"
      /> */}
      <Card
        title="Total Members"
        value={totalMembers}
        type="total"
        color="text-indigo-800"
        span="col-span-1 md:col-span-1"
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
  type:
    | "disbursed"
    | "collected"
    | "pending"
    | "totalLoan"
    | "loanBalance"
    | "total";
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
