import EditMemberForm from "@/app/ui/customers/edit-member-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchMemberById } from "@/app/lib/sun-data";
import { notFound } from "next/navigation";
import HeroBreadcrumbs from "@/app/ui/customers/hero-breadcrumbs";
import {
  UsersBRoundIcon,
  GroupBIcon,
  UserBPen,
} from "@/app/ui/customers/icons";

export default async function Page(props: {
  params: Promise<{ id: string; mid: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const mid = params.mid;
  const [member] = await Promise.all([fetchMemberById(mid)]);

  console.log(member);

  if (!member) {
    notFound();
  }

  return (
    <div>
      <HeroBreadcrumbs
        breadcrumbs={[
          {
            label: "Groups",
            href: "/dashboard/customers",
            icon: <UsersBRoundIcon />,
          },
          {
            label: `Group Details`,
            href: `/dashboard/customers/${id}/details`,
            icon: <GroupBIcon />,
          },
          {
            label: `Edit Member Details`,
            href: `/dashboard/customers/${id}/details/${mid}/edit`,
            icon: <UserBPen />,
          },
        ]}
      />
    </div>
  );
}
