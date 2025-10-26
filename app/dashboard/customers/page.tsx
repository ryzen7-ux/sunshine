import GroupTable from "@/app/ui/customers/group-table";
import { Input } from "@heroui/react";
import SearchGroup from "@/app/ui/customers/search-group";
import {
  fetchFilteredGroups,
  fetchGroupPages,
  fetchRegions,
  fetchUserByEmail,
} from "@/app/lib/sun-data";
import {
  fetchFilteredGroups2,
  fetchGroupPages2,
  fetchRegion2,
} from "@/app/lib/sun-data2";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import GroupPagination from "@/app/ui/customers/pagination";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { Divider } from "@heroui/react";
import { SuccessToast, DeleteSuccessToast } from "@/app/ui/toast";
import { getSession } from "@/app/lib/session";
import { getCurrentUser } from "@/app/lib/current-user";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    success?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const success = searchParams?.success || "false";

  const user = await getSession();
  const isAdmin = user?.role === "admin";
  const curentUser: any = await fetchUserByEmail(user?.email);

  let groups: any = [];
  let totalPages: any = 0;
  let regions: any = [];
  if (isAdmin) {
    groups = await fetchFilteredGroups(query, currentPage);
    totalPages = await fetchGroupPages(query);
    regions = await fetchRegions();
  }

  if (!isAdmin) {
    groups = await fetchFilteredGroups2(query, currentPage, curentUser[0]?.id);
    totalPages = await fetchGroupPages2(query, curentUser[0]?.id);
    regions = await fetchRegion2(curentUser[0]?.id);
  }

  return (
    <>
      <div className="w-full border border-gray-100 px-4 py-4 rounded-lg">
        <SuccessToast success={success} />
        <div className="flex w-full items-center bg-gray-100 rounded-lg px-4 py-4">
          <UserGroupIcon className="h-8 w-8 fill-green-500" />
          <h1 className={`text-2xl font-bold text-gray-900 pl-2`}>Groups</h1>
        </div>

        <div>
          <SearchGroup regions={regions} />
        </div>

        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <GroupTable groups={groups} regions={regions} />
        </Suspense>
        <div className="mt-5 mb-5 flex w-full justify-center">
          <GroupPagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
