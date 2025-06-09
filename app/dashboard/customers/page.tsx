import GroupTable from "@/app/ui/customers/group-table";
import { Input } from "@heroui/react";
import SearchGroup from "@/app/ui/customers/search-group";
import { fetchFilteredGroups, fetchGroupPages } from "@/app/lib/sun-data";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import GroupPagination from "@/app/ui/customers/pagination";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { Divider } from "@heroui/react";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const groups = await fetchFilteredGroups(query, currentPage);
  const totalPages = await fetchGroupPages(query);
  return (
    <>
      <div className="w-full border border-gray-100 px-4 py-4 rounded-lg">
        <div className="flex w-full items-center bg-gray-100 rounded-lg px-4 py-4">
          <UserGroupIcon className="h-8 w-8 fill-green-500" />
          <h1 className={`text-2xl font-bold text-gray-900 pl-2`}>Groups</h1>
        </div>

        <div>
          <SearchGroup />
        </div>

        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <GroupTable groups={groups} />
        </Suspense>
        <div className="mt-5 mb-5 flex w-full justify-center">
          <GroupPagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
