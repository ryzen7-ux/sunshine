import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/cards";
import MothlyCardWrapper from "@/app/ui/dashboard/monthly-cards";
import DashboardTabs from "@/app/ui/dashboard/tabs";
import { DashboardTab2 } from "@/app/ui/dashboard/tabs";

import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import { LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";
import { fetchDashboardCardData } from "@/app/lib/sun-data";
import { fetchRevenue } from "@/app/lib/data";
import RevenueChart2 from "@/app/ui/dashboard/revenue-chart-2";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default async function Page() {
  const {
    groupAmount,
    numberOfMembers,
    totalLoans,
    totalCollectedLoans,
    loanBalance,
    monthlyDisbursement,
    monthlyTotalLoan,
    monthlyLoanBalance,
    monthlyCollected,
    lastFourDisbursement,
  } = await fetchDashboardCardData();

  const revenue = await fetchRevenue();

  return (
    <main>
      <h1
        className={`mb-4 text-xl md:text-xl flex gap-2 p-2 border rounded-md  `}
      >
        <LayoutDashboard className="h-6 w-6 text-green-500" /> Dashboard
      </h1>
      <div className="flex ">
        <DashboardTabs
          groupAmount={groupAmount}
          numberOfMembers={numberOfMembers}
          totalLoans={totalLoans}
          totalCollectedLoans={totalCollectedLoans}
          loanBalance={loanBalance}
          monthlyDisbursement={monthlyDisbursement}
          monthlyTotalLoan={monthlyTotalLoan}
          monthlyLoanBalance={monthlyLoanBalance}
          monthlyCollected={monthlyCollected}
        />
      </div>
      {/* Total Cards stats */}
      {/* <div className="border rounded-md px-4 pt-2 pb-4">
        <h1 className="pb-2 text-md font-bold">Total</h1>
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-5 ">
          <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper />
          </Suspense>
        </div>
      </div> */}
      {/* Monthly Cards stats */}
      {/* <div className="border  rounded-md px-4 pt-2 pb-4 mt-6">
        <div className="flex gap-2 pb-4 items-center">
          {" "}
          <h1 className=" text-md font-bold">This month |</h1>
          <p className=" text-gray-400 text-sm">
            {formatDateToLocal(String(thisMonth))}
          </p>
        </div>
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 ">
          <Suspense fallback={<CardsSkeleton />}>
            <MothlyCardWrapper />
          </Suspense>
        </div>
      </div> */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart2
            revenue={revenue}
            lastFourDisbursement={lastFourDisbursement}
          />
        </Suspense>
      </div>
      <div></div>
    </main>
  );
}
