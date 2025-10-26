"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Rectangle,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const months = [
  { month: "Jan" },
  { month: "Feb" },
  { month: "Mar" },
  { month: "Apr" },
  { month: "May" },
  { month: "Jun" },
  { month: "Jul" },
  { month: "Aug" },
  { month: "Sep" },
  { month: "Oct" },
  { month: "Nov" },
  { month: "Dec" },
];

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const revenueData = [
  {
    month: "Jan",
    revenue: 8500,
    expenses: 6200,
    profit: 2300,
    ads: 45,
    sponsors: 12,
  },
  {
    month: "Feb",
    revenue: 9200,
    expenses: 6800,
    profit: 2400,
    ads: 52,
    sponsors: 15,
  },
  {
    month: "Mar",
    revenue: 10100,
    expenses: 7200,
    profit: 2900,
    ads: 58,
    sponsors: 18,
  },
  {
    month: "Apr",
    revenue: 11300,
    expenses: 7800,
    profit: 3500,
    ads: 62,
    sponsors: 20,
  },
  {
    month: "May",
    revenue: 12450,
    expenses: 8200,
    profit: 4250,
    ads: 68,
    sponsors: 22,
  },
  {
    month: "Jun",
    revenue: 13200,
    expenses: 8600,
    profit: 4600,
    ads: 72,
    sponsors: 25,
  },
];
export default function RevenueChart2({
  revenue,
  lastFourDisbursement,
}: {
  revenue: any;
  lastFourDisbursement: any;
}) {
  const thisMonth = new Date().getMonth() + 1;
  const revenueData = revenue?.slice(thisMonth - 4, thisMonth);
  const monthData = lastFourDisbursement?.slice(thisMonth - 4, thisMonth) ?? [];
  const monthArray = months.slice(thisMonth - 4, thisMonth);

  const rev = revenueData.map((item: any, index: any) => ({
    month: monthArray[index].month,
    revenue: Number(item.revenue),
    disbursed: Number(monthData[index]?.disbursed ?? 0),
  }));

  // const monthPrincipal = monthData.map((item: any, index: any) => ({
  //   month: monthArray[index].month,
  //   principal: Number(item.revenue),
  // }));
  return (
    <div className="w-full md:col-span-4">
      <div
        className={`mb-2 text-md md:text-lg flex gap-2 items-center w-full `}
      >
        <TrendingUp className="h-6 w-6 text-indigo-500" />
        <p className="flex">Recent Revenue</p>
      </div>
      <div className="">
        <BarChart
          width={500}
          height={450}
          data={rev}
          margin={{
            top: 5,
            right: 5,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="#433f8dff"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="disbursed"
            fill="#3dc772ff"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </div>
    </div>
  );
}
