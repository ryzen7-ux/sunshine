import Pagination from "@/app/ui/mpesa/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/mpesa/table";
import { CreateInvoice } from "@/app/ui/mpesa/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchMpesaInvoicesPages } from "@/app/lib/sun-data";
import { Metadata } from "next";
import { Coins } from "lucide-react";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPagesGroupInvoice = await fetchMpesaInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="">
        <h1
          className={`text-2xl flex gap-2 items-center border p-2 rounded-md`}
        >
          <Coins className="h-6 w-6 text-green-500" /> Mpesa Invoices
        </h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        {/* <CreateInvoice /> */}
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesGroupInvoice} />
      </div>
    </div>
  );
}
