import MemberForm from "@/app/ui/customers/member-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import HeroBreadcrumbs from "@/app/ui/customers/hero-breadcrumbs";
import {
  UsersBRoundIcon,
  GroupBIcon,
  UserBPlus,
} from "@/app/ui/customers/icons";

export default async function Page(props: {
  params: Promise<{ id: string; mid: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const mid = params.mid;

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
            label: `Add Member`,
            href: `/dashboard/customers/${id}/details/${mid}/create`,
            icon: <UserBPlus />,
          },
        ]}
      />
      <MemberForm groupId={id} />
    </div>
  );
}
