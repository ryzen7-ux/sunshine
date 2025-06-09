import Form from "@/app/ui/customers/edit-group-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchGroupById } from "@/app/lib/sun-data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [group] = await Promise.all([fetchGroupById(id)]);

  if (!group) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Groups", href: "/dashboard/customers" },
          {
            label: "Edit group",
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form setIsSuccess={false} group={group} />
    </main>
  );
}
