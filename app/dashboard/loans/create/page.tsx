//@ts-nocheck

import CreateLoan from "@/app/ui/loans/loan-from";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchGroups, fetchGroupMembers } from "@/app/lib/sun-data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const groups = await fetchGroups();
  const members = await fetchGroupMembers(query);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Loans", href: "/dashboard/loans" },
          {
            label: `New Loan`,
            href: `/dashboard/loans/create`,
            active: true,
          },
        ]}
      />
      <CreateLoan groups={groups} members={members} />
    </div>
  );
}
