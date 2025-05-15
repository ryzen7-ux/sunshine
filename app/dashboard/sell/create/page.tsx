import Form from "@/app/ui/sell/create-form";
import Breadcrumbs from "@/app/ui/sell/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Sell", href: "/dashboard/sell" },
          {
            label: "Create Invoice",
            href: "/dashboard/sell/create",
            active: true,
          },
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Form customers={customers} />
        </div>
        <div className="flex justify-center">
          <h1>Invoice</h1>
        </div>
      </div>
    </main>
  );
}
