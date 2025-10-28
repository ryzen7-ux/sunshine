import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/cards";
import MothlyCardWrapper from "@/app/ui/dashboard/monthly-cards";
import DashboardTabs from "@/app/ui/dashboard/tabs";
import { DashboardTab2 } from "@/app/ui/dashboard/tabs";
import DisbursementCycle from "@/app/ui/dashboard/disbursement-cycle";
import IndividualFilters from "@/app/ui/dashboard/individuals-filters";
import RegionFilter from "@/app/ui/dashboard/region-filter";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import { LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";
import {
  fetchDashboardCardData,
  fetchDashboardMaxCycle,
  fetchRegions,
  fetchIndividualsDashbordCards,
  fetchIndividualsMaxCycle,
  fetchUserByEmail,
} from "@/app/lib/sun-data";
import { fetchRevenue } from "@/app/lib/data";
import RevenueChart2 from "@/app/ui/dashboard/revenue-chart-2";
import { getSession } from "@/app/lib/session";
import Regions from "@/app/ui/system-management/regions";
import { map } from "zod";
import { decodeMsisdnValue } from "@/app/lib/utils";

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
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    iQuery?: string;
    regionQuery?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const iQuery = searchParams?.iQuery || "";
  const regionQuery = searchParams?.regionQuery || "";
  const regions = await fetchRegions();
  const user = await getSession();
  const isAdmin = user?.role === "admin";
  const curentUser: any = await fetchUserByEmail(user?.email);

  let regionArr: any = [];
  let selectRegions: any = regions;

  if (isAdmin) {
    regionArr = regions?.map((item: any) => item.id);
    if (regionQuery) {
      if (regionQuery !== "all") {
        regionArr = [regionQuery];
      }
    }
  }

  if (!isAdmin) {
    const filteredRegions = regions?.filter(
      (item: any) => item?.manager === curentUser[0].id
    );
    selectRegions = filteredRegions;
    regionArr = filteredRegions?.map((item: any) => item.id);
    if (regionQuery) {
      if (regionQuery !== "all") {
        regionArr = [regionQuery];
      }
    }
  }

  const groupLoansData = await fetchDashboardCardData(query, regionArr);

  const revenue = await fetchRevenue();

  const maxCycle: any = await fetchDashboardMaxCycle();

  const individualsMaxCyle: any = await fetchIndividualsMaxCycle();

  const individualLoanData = await fetchIndividualsDashbordCards(
    iQuery,
    regionArr
  );

  let groupCycle = "All";
  if (query) {
    groupCycle = query;
  }
  let individualsCycle = "All";
  if (iQuery) {
    individualsCycle = iQuery;
  }

  return (
    <main>
      <h1
        className={`mb-4 text-xl md:text-xl flex gap-2 p-2 border rounded-md  `}
      >
        <LayoutDashboard className="h-6 w-6 text-green-500" /> Dashboard
      </h1>
      <RegionFilter maxCycle={maxCycle} selectRegions={selectRegions} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-green-500 rounded-md p-2">
          <h2 className="text-md font-bold  pb-2">Group Stats</h2>
          <div className=" border-b mb-2 pb-2">
            <DisbursementCycle maxCycle={maxCycle} />{" "}
          </div>
          <DashboardTabs
            groupAmount={groupLoansData?.groupAmount}
            numberOfMembers={groupLoansData?.numberOfMembers}
            totalLoans={groupLoansData?.totalLoans}
            totalCollectedLoans={groupLoansData?.totalCollectedLoans}
            loanBalance={groupLoansData?.loanBalance}
            monthlyDisbursement={groupLoansData?.monthlyDisbursement}
            monthlyTotalLoan={groupLoansData?.monthlyTotalLoan}
            monthlyLoanBalance={groupLoansData?.loanBalance}
            monthlyCollected={groupLoansData?.monthlyCollected}
            weeklyDisbursed={groupLoansData?.weeklyDisbursed}
            weeklyTotalLoan={groupLoansData?.weeklyTotalLoan}
            weeklyCollected={groupLoansData?.weeklyCollected}
            weeklyLoanBalance={groupLoansData?.loanBalance}
            todayDisbursed={groupLoansData?.todayDisbursed}
            todayTotalLoan={groupLoansData?.todayTotalLoan}
            todayCollected={groupLoansData?.todayCollected}
            todayLoanBalance={groupLoansData?.loanBalance}
            groupCycle={groupCycle}
            user={user}
          />
        </div>
        <div className="border border-green-500 rounded-md p-2">
          <h2 className="text-md font-bold  pb-2">Individuals Stats</h2>
          <div className="border-b mb-2 pb-2">
            <IndividualFilters
              regions={regions}
              maxCycle={individualsMaxCyle}
            />
          </div>
          <DashboardTabs
            groupAmount={individualLoanData?.totalIndividualDisbursed}
            numberOfMembers={individualLoanData?.totalIndivdualLoanees}
            totalLoans={Number(individualLoanData?.totalIndividualLoans)}
            totalCollectedLoans={individualLoanData?.totalIndividualCollected}
            loanBalance={
              individualLoanData?.totalIndividualLoans -
              individualLoanData?.totalIndividualCollected
            }
            monthlyDisbursement={individualLoanData?.monthIndividualDisbursed}
            monthlyTotalLoan={individualLoanData?.monthIndividualLoan}
            monthlyLoanBalance={
              individualLoanData?.totalIndividualLoans -
              individualLoanData?.totalIndividualCollected
            }
            monthlyCollected={Number(
              individualLoanData?.monthIndividualCollected
            )}
            weeklyDisbursed={individualLoanData?.weekIndividualDisbursed}
            weeklyTotalLoan={individualLoanData?.weekIndividualLoan}
            weeklyCollected={individualLoanData?.weekIndividualCollected}
            weeklyLoanBalance={
              individualLoanData?.totalIndividualLoans -
              individualLoanData?.totalIndividualCollected
            }
            todayDisbursed={individualLoanData?.todayIndividualDisbursed}
            todayTotalLoan={individualLoanData?.todayIndividualLoan}
            todayCollected={individualLoanData?.todayIndividualCollected}
            todayLoanBalance={
              individualLoanData?.totalIndividualLoans -
              individualLoanData?.totalIndividualCollected
            }
            groupCycle={individualsCycle}
            user={user}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart2
            revenue={revenue}
            lastFourDisbursement={groupLoansData?.lastFourDisbursement}
          />
        </Suspense>
      </div>
      <div></div>
    </main>
  );
}
