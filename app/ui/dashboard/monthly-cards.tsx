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
import { fetchDashboardCardData } from "@/app/lib/sun-data";

const iconMap = {
  disbursed: ScaleIcon,
  collected: BanknotesIcon,
  customers: UsersIcon,
  active: ClockIcon,
  pending: CircleStackIcon,
};

interface tabsProps {
  monthlyDisbursement: any;
  monthlyTotalLoan: any;
  monthlyLoanBalance: any;
  monthlyCollected: any;
}

export default function MothlyCardWrapper({
  monthlyDisbursement,
  monthlyTotalLoan,
  monthlyLoanBalance,
  monthlyCollected,
}: tabsProps) {
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card
        title="Disbursed"
        value={monthlyDisbursement}
        type="disbursed"
        color="text-indigo-800"
        span=""
      />
      <Card
        title="Collected"
        value={monthlyCollected}
        type="collected"
        color="text-green-800"
        span=""
      />
      <Card
        title="Loans"
        value={monthlyTotalLoan}
        type="pending"
        color="text-yellow-800"
        span=""
      />
      <Card
        title="Loan Balance"
        value={monthlyLoanBalance}
        type="active"
        color="text-indigo-800 "
        span=""
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
  type: "disbursed" | "collected" | "pending" | "active" | "customers";
  color: string;
  span: string;
}) {
  const Icon = iconMap[type];

  return (
    <div className={`ring-2 ring-pink-700 rounded-xl bg-gray-50  ${span}`}>
      <div className="flex p-2">
        {Icon ? <Icon className={`h-6 w-6 ${color}`} /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-b-xl bg-white px-4 py-2 text-center text-green-600 text-lg font-black`}
      >
        {value}
      </p>
    </div>
  );
}
