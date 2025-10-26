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
  fetchIndividualsCardsData,
  fetchIndividualsMaxCycle,
  fetchUserByEmail,
} from "@/app/lib/sun-data";
import { getCurrentUser } from "@/app/lib/current-user";
import Table from "@/app/ui/individuals/table";
import LoansTable from "@/app/ui/individuals/loans-table";
import Pagination from "@/app/ui/individuals/pagination";
import LoansPagination from "@/app/ui/individuals/loans-pagination";
import AddLoan from "@/app/ui/individuals/add-loans";
import IndividualsTab from "@/app/ui/individuals/tabs";
import { Cuboid } from "lucide-react";
import { getSession } from "@/app/lib/session";

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

  const user = await getSession();
  const isAdmin = user?.role === "admin";
  const curentUser: any = await fetchUserByEmail(user?.email);
  const regions = await fetchRegions();

  let regionArr: any = [];
  if (isAdmin) {
    regionArr = regions?.map((item: any) => item.id);
  }

  if (!isAdmin) {
    const filteredRegions = regions?.filter(
      (item: any) => item?.manager === curentUser[0].id
    );

    regionArr = filteredRegions?.map((item: any) => item.id);
  }

  const totalPages = await fetchIndividualPages(query, regionArr);
  const totalLoanPages = await fetchIndividualLoansPages(loansquery, regionArr);

  const loans = await fetchFilteredIndividualLoans(
    loansquery,
    loansCurrentPage,
    regionArr
  );

  const filteredIndividuals = await fetchFilteredIndividuals(
    query,
    currentPage,
    regionArr
  );

  const filteredLoanIndividuals = await fetchFilteredIndividuals(
    loansquery,
    loansCurrentPage,
    regionArr
  );
  const users = await fetchUsers();
  const individuals = await fetchIndividuals(regionArr);
  const individual = await fetchIndividualsById(indiviudalId);

  const maxCycle = await fetchIndividualsMaxCycle();

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
          maxCycle={maxCycle}
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
