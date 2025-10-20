import Pagination from "@/app/ui/loans/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/loans/table";
import { CreateInvoice } from "@/app/ui/loans/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import {
  fetchLoansPages,
  fetchGroups,
  fetchGroupMembers,
  fetchLoanByIdNew,
} from "@/app/lib/sun-data";
import { Metadata } from "next";
import { ProcessDisbursement } from "@/app/ui/loans/buttons";

export const metadata: Metadata = {
  title: "Loans",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    memberQuery?: string;
  }>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const memberQuery = searchParams?.memberQuery || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchLoansPages(query);

  const params = await props.params;
  const id = params.id;

  let loan: any = [];

  if (id) {
    [loan] = await Promise.all([fetchLoanByIdNew(id)]);
  }

  const groups = await fetchGroups();
  const members = await fetchGroupMembers(memberQuery);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-xl font-bold text-gray-900`}>
          Loans and Disbursments
        </h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search loans..." />

        <CreateInvoice groups={groups} members={members} />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} loan={loan} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
