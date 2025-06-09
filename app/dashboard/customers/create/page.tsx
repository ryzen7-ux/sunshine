import GroupForm from "@/app/ui/customers/group-form";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import HeroBreadcrumbs from "@/app/ui/customers/hero-breadcrumbs";
import { UsersBRoundIcon } from "@/app/ui/customers/icons";

export default function CreateGroup() {
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
            label: "Create Group",
            href: "/dashboard/customers/create",
          },
        ]}
      />
      <GroupForm setIsSuccess={false} />
    </div>
  );
}
