"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { ChartPie, Calendar1, HandCoins, ChartArea } from "lucide-react";
import CardWrapper from "@/app/ui/dashboard/cards";
import MothlyCardWrapper from "@/app/ui/dashboard/monthly-cards";
import { Suspense } from "react";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

interface tabsProps {
  groupAmount: any;
  numberOfMembers: any;
  totalLoans: any;
  totalCollectedLoans: any;
  loanBalance: any;
  monthlyDisbursement: any;
  monthlyTotalLoan: any;
  monthlyLoanBalance: any;
  monthlyCollected: any;
}

export default function DashboardTabs({
  groupAmount,
  numberOfMembers,
  totalLoans,
  totalCollectedLoans,
  loanBalance,
  monthlyDisbursement,
  monthlyTotalLoan,
  monthlyLoanBalance,
  monthlyCollected,
}: tabsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Tabs aria-label="Options" color="secondary" size="sm">
        <Tab
          key="overview"
          title={
            <div className="flex items-center space-x-4">
              <ChartPie className="h-4 w-4 text-pink-500" />
              <span>Overview</span>
            </div>
          }
        >
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-5 ">
            <Suspense fallback={<CardsSkeleton />}>
              <CardWrapper
                groupAmount={groupAmount}
                numberOfMembers={numberOfMembers}
                totalLoans={totalLoans}
                totalCollectedLoans={totalCollectedLoans}
                loanBalance={loanBalance}
              />
            </Suspense>
          </div>
        </Tab>
        <Tab
          key="month"
          title={
            <div className="flex items-center space-x-4">
              <Calendar1 className="h-4 w-4 text-yellow-500" />
              <span>This month</span>
            </div>
          }
        >
          {" "}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 ">
            <Suspense fallback={<CardsSkeleton />}>
              <MothlyCardWrapper
                monthlyDisbursement={monthlyDisbursement}
                monthlyTotalLoan={monthlyTotalLoan}
                monthlyLoanBalance={monthlyLoanBalance}
                monthlyCollected={monthlyCollected}
              />
            </Suspense>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export function DashboardTab2() {
  return (
    <>
      <Tabs aria-label="Options" color="secondary" size="sm">
        <Tab
          key="revenue"
          title={
            <div className="flex items-center space-x-4">
              <HandCoins className="h-4 w-4 text-green-500" />
              <span>Revenue</span>
            </div>
          }
        ></Tab>
        <Tab
          key="performacne"
          title={
            <div className="flex items-center space-x-4">
              <ChartArea className="h-4 w-4 text-cyan-500" />
              <span>Perfomance</span>
            </div>
          }
        ></Tab>
      </Tabs>
    </>
  );
}
