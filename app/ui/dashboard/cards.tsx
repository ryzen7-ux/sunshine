import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  ScaleIcon,
  UsersIcon,
  CalendarDaysIcon,
  CalendarIcon,
  CircleStackIcon,
} from "@heroicons/react/24/solid";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import {
  formatDateToLocal,
  formatCurrency,
  formatCurrencyToLocal,
} from "@/app/lib/utils";

interface tabsProps {
  groupAmount: any;
  numberOfMembers: any;
  totalLoans: any;
  totalCollectedLoans: any;
  loanBalance: any;
  selected: string;
  groupCycle: any;
  user: any;
}

const iconMap = {
  disbursed: ScaleIcon,
  collected: BanknotesIcon,
  customers: UsersIcon,
  active: ClockIcon,
  pending: CircleStackIcon,
};

export default function CardWrapper({
  groupAmount,
  numberOfMembers,
  totalLoans,
  totalCollectedLoans,
  loanBalance,
  selected,
  groupCycle,
  user,
}: tabsProps) {
  console.log("dsadsa", groupAmount);
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}
      <Card
        title="Disbursed"
        value={groupAmount ?? 0}
        type="disbursed"
        color="text-blue-800"
        span=""
        user={user}
      />
      <Card
        title="Paid"
        value={totalCollectedLoans ?? 0}
        type="collected"
        color="text-green-800"
        span=""
        user={user}
      />
      <Card
        title="Loans"
        value={totalLoans ?? 0}
        type="pending"
        color="text-yellow-800"
        span=""
        user={user}
      />
      <Card
        title={`Cycle: ${groupCycle} ~ Loan Balance`}
        value={loanBalance ?? 0}
        type="active"
        color="text-indigo-800"
        span=""
        user={user}
      />

      <Card
        title="Total Loanees"
        value={numberOfMembers ?? 0}
        type="customers"
        color="text-pink-800"
        span="col-span-2 md:col-span-2"
        user={user}
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
  user,
}: {
  title: string;
  value: number;
  type: "disbursed" | "collected" | "pending" | "active" | "customers";
  color: string;
  span: string;
  user: any;
}) {
  const Icon = iconMap[type];

  return (
    <div className={`ring-2 ring-blue-700 rounded-xl bg-gray-50  ${span}`}>
      <div className="flex p-2">
        {Icon ? <Icon className={`h-6 w-6 ${color}`} /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-b-xl bg-white px-2 py-2 text-center text-green-600 text-sm font-black`}
      >
        {type === "customers"
          ? value
          : formatCurrencyToLocal(Number(value ?? 0))}
      </p>
    </div>
  );
}
