import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/cards";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import { auth } from "@/auth";
import Staff from "@/app/ui/system-management/staff";
import Regions from "@/app/ui/system-management/regions";
import AddStaff from "@/app/ui/system-management/add-staff";
import AddRegion from "@/app/ui/system-management/add-region";
import { fetchUsers, fetchRegions, fetchUserById } from "@/app/lib/sun-data";
import { getCurrentUser } from "@/app/lib/current-user";
import { MonitorCog } from "lucide-react";

export default async function Page() {
  const users = await fetchUsers();
  const regions = await fetchRegions();
  const user = await getCurrentUser();

  return (
    <main>
      <h1
        className={`mb-4 text-xl md:text-xl font-bold flex gap-2 text-green-600 border rounded-md p-2`}
      >
        <MonitorCog className="h-6 w-6 text-green-500" /> System Management
      </h1>
      <div className="border rounded-md px-2 pb-6">
        <div className="w-full">
          <AddStaff />
        </div>
        <div className="mt-2">
          <Staff users={users} />
        </div>
      </div>
      <div className="border rounded-md px-2 pb-6 mt-6">
        <div className="w-full">
          <AddRegion users={users} />
        </div>
        <div className="w-full">
          <Regions users={users} regions={regions} />
        </div>
      </div>
    </main>
  );
}
