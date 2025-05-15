import Pagination from "@/app/ui/sell/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/sell/table";
import SellItems from "@/app/ui/sell/items";
import { CreateInvoice } from "@/app/ui/sell/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales"
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
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-8 mt-4 flex items-center justify-between  md:mt-8">
        <SellItems />
        <div></div>
       
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
       
      </div>
    </div>
  );
}
