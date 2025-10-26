"use client";

import { useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import {
  ChartPie,
  Calendar1,
  HandCoins,
  ChartArea,
  CalendarDays,
  CalendarCheck,
  CalendarRange,
} from "lucide-react";
import CardWrapper from "@/app/ui/dashboard/cards";
import MothlyCardWrapper from "@/app/ui/dashboard/monthly-cards";
import { Suspense } from "react";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import DisbursementCycle from "@/app/ui/dashboard/disbursement-cycle";

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
  weeklyDisbursed: any;
  weeklyTotalLoan: any;
  weeklyCollected: any;
  weeklyLoanBalance: any;
  todayDisbursed: any;
  todayTotalLoan: any;
  todayCollected: any;
  todayLoanBalance: any;
  groupCycle: any;
  user: any;
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
  weeklyDisbursed,
  weeklyTotalLoan,
  weeklyCollected,
  weeklyLoanBalance,
  todayDisbursed,
  todayTotalLoan,
  todayCollected,
  todayLoanBalance,
  groupCycle,
  user,
}: tabsProps) {
  const [selected, setSelected] = useState<any>("today");

  return (
    <div className="flex flex-col gap-4 w-full">
      <Tabs
        aria-label="Options"
        color="secondary"
        size="sm"
        selectedKey={selected}
        onSelectionChange={setSelected}
      >
        <Tab
          key="today"
          title={
            <div className="flex items-center space-x-4">
              <Calendar1
                className={`h-4 w-4 ${
                  selected === "today" ? "text-white" : "text-cyan-700"
                }`}
              />
              <span
                className={`${
                  selected === "today" ? "text-white" : "text-gray-900"
                }`}
              >
                Today
              </span>
            </div>
          }
        >
          {" "}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-2 ">
            <Suspense fallback={<CardsSkeleton />}>
              <MothlyCardWrapper
                numberOfMembers={numberOfMembers}
                monthlyDisbursement={todayDisbursed}
                monthlyTotalLoan={todayTotalLoan}
                monthlyLoanBalance={todayLoanBalance}
                monthlyCollected={todayCollected}
                selected={selected}
                groupCycle={groupCycle}
                user={user}
              />
            </Suspense>
          </div>
        </Tab>
        <Tab
          key="week"
          title={
            <div className="flex items-center space-x-4">
              <CalendarRange
                className={`h-4 w-4 ${
                  selected === "week" ? "text-white" : "text-pink-700"
                }`}
              />
              <span
                className={`${
                  selected === "week" ? "text-white" : "text-gray-900"
                }`}
              >
                This Week
              </span>
            </div>
          }
        >
          {" "}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-2 ">
            <Suspense fallback={<CardsSkeleton />}>
              <MothlyCardWrapper
                numberOfMembers={numberOfMembers}
                monthlyDisbursement={weeklyDisbursed}
                monthlyTotalLoan={weeklyTotalLoan}
                monthlyLoanBalance={weeklyLoanBalance}
                monthlyCollected={weeklyCollected}
                selected={selected}
                groupCycle={groupCycle}
                user={user}
              />
            </Suspense>
          </div>
        </Tab>
        <Tab
          key="month"
          title={
            <div className="flex items-center space-x-4">
              <CalendarDays
                className={`h-4 w-4 ${
                  selected === "month" ? "text-white" : "text-green-700"
                }`}
              />
              <span
                className={`${
                  selected === "month" ? "text-white" : "text-gray-900"
                }`}
              >
                This month
              </span>
            </div>
          }
        >
          {" "}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-2 ">
            <Suspense fallback={<CardsSkeleton />}>
              <MothlyCardWrapper
                numberOfMembers={numberOfMembers}
                monthlyDisbursement={monthlyDisbursement}
                monthlyTotalLoan={monthlyTotalLoan}
                monthlyLoanBalance={monthlyLoanBalance}
                monthlyCollected={monthlyCollected}
                selected={selected}
                groupCycle={groupCycle}
                user={user}
              />
            </Suspense>
          </div>
        </Tab>
        <Tab
          key="overview"
          title={
            <div className="flex items-center space-x-4">
              <CalendarCheck
                className={`h-4 w-4 ${
                  selected === "overview" ? "text-white" : "text-blue-700"
                }`}
              />
              <span
                className={`${
                  selected === "overview" ? "text-white" : "text-gray-900"
                }`}
              >
                All
              </span>
            </div>
          }
        >
          {/* <div className=" mb-4">
            <CardsSkeleton />
          </div> */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-2 ">
            <Suspense fallback={<CardsSkeleton />}>
              <CardWrapper
                groupAmount={groupAmount}
                numberOfMembers={numberOfMembers}
                totalLoans={totalLoans}
                totalCollectedLoans={totalCollectedLoans}
                loanBalance={loanBalance}
                selected={selected}
                groupCycle={groupCycle}
                user={user}
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
