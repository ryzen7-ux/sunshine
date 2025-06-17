import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {
  fetchGroupById,
  fetchMemberById,
  fetchLoanById,
} from "@/app/lib/sun-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/customers/cards";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import MemberDetails from "@/app/ui/customers/member-details";
import HeroBreadcrumbs from "@/app/ui/customers/hero-breadcrumbs";
import {
  UsersBRoundIcon,
  GroupBIcon,
  UserBCheckIcon,
} from "@/app/ui/customers/icons";

export default async function Page(props: {
  params: Promise<{ id: string; mid: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const mid = params.mid;
  const [group] = await Promise.all([fetchGroupById(id)]);
  const [member] = await Promise.all([fetchMemberById(mid)]);
  const [loan] = await Promise.all([fetchLoanById(mid)]);

  console.log(loan);
  if (!member) {
    notFound();
  }

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
            label: `${group.name}`,
            href: `/dashboard/customers/${id}/details`,
            icon: <GroupBIcon />,
          },
          {
            label: `Member Details`,
            href: `/dashboard/customers/${id}/details/${mid}/details`,
            icon: <UserBCheckIcon />,
          },
        ]}
      />
      <div className="flex flex-col md:flex-row gap-4">
        <MemberDetails memberData={member} loan={loan} />
      </div>
    </main>
  );
}
