import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {
  fetchGroupById,
  fetchMembers,
  fetchGroupCardData,
  fetchMaxCycle,
} from "@/app/lib/sun-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/customers/cards";
import MembersTable from "@/app/ui/customers/members-table";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import { Group } from "lucide-react";
import SearchMembers from "@/app/ui/customers/search-members";
import HeroBreadcrumbs from "@/app/ui/customers/hero-breadcrumbs";
import { UsersBRoundIcon } from "@/app/ui/customers/icons";
import { Divider } from "@heroui/react";
import DisbursementCycle from "@/app/ui/customers/disbursement-cycle";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const query = searchParams?.query || "";
  const id = params.id;

  const [group] = await Promise.all([fetchGroupById(id)]);
  const [members] = await Promise.all([fetchMembers(id)]);

  if (!group) {
    notFound();
  }

  const maxCycle = await fetchMaxCycle(id);

  const {
    groupDisbusredAmount,
    totalPayment,
    totalMembers,
    balance,
    totalMpesa,
  } = await fetchGroupCardData(id, group.name, query);

  return (
    <main>
      <HeroBreadcrumbs
        breadcrumbs={[
          {
            label: "Groups",
            href: "/dashboard/customers",
            icon: <UsersBRoundIcon />,
          },
          {
            label: "Group Details",
            href: `/dashboard/customers/${id}/details`,
          },
        ]}
      />
      <div className="border rounded-lg px-4 py-2 bg-gray-100">
        <div className="flex w-full items-center pb-2">
          <h1 className={`text-xl font-bold text-gray-900`}>{group.name}</h1>
        </div>
        <DisbursementCycle maxCycle={maxCycle} />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper
              groupDisbusredAmount={groupDisbusredAmount}
              totalPayment={totalPayment}
              totalMembers={totalMembers}
              balance={balance}
              totalMpesa={totalMpesa}
            />
          </Suspense>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-lg font-bold text-gray-900`}>Group Members</h1>
            <SearchMembers group={group} />
          </div>
          <MembersTable group={group} members={members} />
        </div>
      </div>
    </main>
  );
}
