"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { UserCog, BanknoteArrowDown } from "lucide-react";
import Table from "@/app/ui/individuals/table";
import LoansTable from "@/app/ui/individuals/loans-table";
import Pagination from "@/app/ui/individuals/pagination";
import LoansPagination from "@/app/ui/individuals/loans-pagination";
import AddLoan from "@/app/ui/individuals/add-loans";
import AddIndividuals from "@/app/ui/individuals/add-individuals";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";

interface tabsProps {
  regions: any;
  query: any;
  currentPage: any;
  totalPages: any;
  individual: any;
  individuals: any;
  loansQuery: any;
  loansCurrentPage: any;
  loansTotalPages: any;
  filtredIndividuals: any;
  filteredLoanIndividuals: any;
  loans: any;
  maxCycle: any;
  detailLoans: any;
}
export default function IndividualsTab({
  regions,
  query,
  currentPage,
  totalPages,
  individual,
  individuals,
  loansQuery,
  loansCurrentPage,
  loansTotalPages,
  filtredIndividuals,
  filteredLoanIndividuals,
  loans,
  maxCycle,
  detailLoans,
}: tabsProps) {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        size="lg"
        className="border-1 p-2 rounded-md"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-4">
              <UserCog className="h-6 w-6 text-yellow-500" />
              <span>Individual Loanees</span>
            </div>
          }
        >
          <Card className="border rounded-md shadow-sm w-full">
            <CardBody>
              <div className="w-full">
                <AddIndividuals regions={regions} />
              </div>
              <div className="">
                <Suspense
                  key={query + currentPage}
                  fallback={<InvoicesTableSkeleton />}
                >
                  <Table
                    query={query}
                    currentPage={currentPage}
                    filtredIndividuals={filtredIndividuals}
                    regions={regions}
                    detailLoans={detailLoans}
                  />
                </Suspense>
                <div className="my-5 flex w-full justify-center">
                  <Pagination totalPages={totalPages} />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-4">
              <BanknoteArrowDown className="h-6 w-6 text-yellow-500" />
              <span>Loan Management</span>
            </div>
          }
        >
          <Card className="shadow-sm border rounded-md">
            <CardBody>
              <div className="w-full">
                <AddLoan
                  individual={individual}
                  individuals={individuals}
                  regions={regions}
                  maxCycle={maxCycle}
                />
              </div>
              <div className="">
                <Suspense
                  key={loansQuery + loansCurrentPage}
                  fallback={<InvoicesTableSkeleton />}
                >
                  <LoansTable
                    filteredLoanIndividuals={filteredLoanIndividuals}
                    loans={loans}
                    loansQuery={loansQuery}
                    loansCurrentPage={loansCurrentPage}
                  />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                  <LoansPagination loansTotalPages={loansTotalPages} />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
