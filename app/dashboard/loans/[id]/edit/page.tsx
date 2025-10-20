import Form from "@/app/ui/loans/edit-form";
import Breadcrumbs from "@/app/ui/loans/breadcrumbs";
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { fetchLoanByIdNew } from "@/app/lib/sun-data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [loan] = await Promise.all([fetchLoanByIdNew(id)]);

  if (!loan) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Loans", href: "/dashboard/loans" },
          {
            label: "Edit Loan",
            href: `/dashboard/loans/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form loan={loan} onClose={() => null} />
    </main>
  );
}
