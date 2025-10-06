import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import AddIndividuals from "@/app/ui/individuals/add-individuals";
import AddLoans from "@/app/ui/individuals/add-loans";
import {
  fetchUsers,
  fetchRegions,
  fetchUserById,
  fetchIndividualPages,
  fetchIndividuals,
  fetchIndividualsByIdNumber,
  fetchIndividualsById,
  fetchIndividualLoansPages,
  fetchFilteredIndividuals,
  fetchFilteredIndividualLoans,
} from "@/app/lib/sun-data";
import { getCurrentUser } from "@/app/lib/current-user";
import Table from "@/app/ui/individuals/table";
import LoansTable from "@/app/ui/individuals/loans-table";
import Pagination from "@/app/ui/individuals/pagination";
import LoansPagination from "@/app/ui/individuals/loans-pagination";
import AddLoan from "@/app/ui/individuals/add-loans";
import IndividualsTab from "@/app/ui/individuals/tabs";
import { Cuboid } from "lucide-react";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    id?: string;
    loansquery?: string;
    loanspage?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.loansquery || "";
  const loansquery = searchParams?.query || "";
  const indiviudalId = searchParams?.id || "";
  const currentPage = Number(searchParams?.page) || 1;
  const loansCurrentPage = Number(searchParams?.loanspage) || 1;

  const totalPages = await fetchIndividualPages(query);
  const totalLoanPages = await fetchIndividualLoansPages(loansquery);

  const loans = await fetchFilteredIndividualLoans(
    loansquery,
    loansCurrentPage
  );

  const filteredIndividuals = await fetchFilteredIndividuals(
    query,
    currentPage
  );

  const filteredLoanIndividuals = await fetchFilteredIndividuals(
    loansquery,
    loansCurrentPage
  );
  const users = await fetchUsers();
  const individuals = await fetchIndividuals();
  const individual = await fetchIndividualsById(indiviudalId);
  const regions = await fetchRegions();
  const user = await getCurrentUser();
  return (
    <main className="">
      <h1 className={`mb-4 text-xl md:text-xl font-bold flex gap-2`}>
        <Cuboid className="h-6 w-6 text-green-500" /> Individual borrowers
        management
      </h1>
      <div className="w-full">
        <IndividualsTab
          regions={regions}
          query={query}
          currentPage={currentPage}
          totalPages={totalPages}
          individual={individual}
          individuals={individuals}
          loansQuery={loansquery}
          loansCurrentPage={loansCurrentPage}
          loansTotalPages={totalLoanPages}
          filtredIndividuals={filteredIndividuals}
          filteredLoanIndividuals={filteredLoanIndividuals}
          loans={loans}
        />
        {/* <AddIndividuals regions={regions} /> */}
      </div>
      {/* <div className="mt-6 ">
        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="my-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div> */}
      {/* <hr /> */}
      {/* INDIVIDUAL LOANS */}
      {/* <div className="w-full">
        <AddLoan
          individual={individual}
          individuals={individuals}
          regions={regions}
        />
      </div>
      <div className="mt-6 ">
        <Suspense
          key={loansquery + loansCurrentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <LoansTable
            loansQuery={loansquery}
            loansCurrentPage={loansCurrentPage}
          />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <LoansPagination loansTotalPages={totalLoanPages} />
        </div>
      </div> */}
    </main>
  );
}
