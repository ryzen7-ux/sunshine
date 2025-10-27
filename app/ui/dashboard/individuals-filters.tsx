"use client";

import { Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { HandCoins, ChartPie } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function IndividualFilters({
  maxCycle,
  regions,
}: {
  maxCycle: any;
  regions: any;
}) {
  const cycles = [...Array(maxCycle[0].max ? maxCycle[0].max + 1 : 0)].map(
    (x, i) => ({
      value: String(i),
      label: `Cycle ${i}`,
    })
  );
  cycles.push({ value: "all", label: "All" });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("iQuery", term);
    } else {
      params.delete("Iquery");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 200);
  const [select, setSelect] = useState<any>("all");

  return (
    <>
      <div className="w-full">
        <Select
          size="sm"
          variant="faded"
          color="success"
          className="w-full "
          endContent={<ChartPie className="h-5 w-5 text-green-700" />}
          placeholder="Cycles"
          description={`Change to view other disbursement cycles: Latest individuals disbursement cycle: ${
            maxCycle[0].max ?? 0
          }`}
          selectedKeys={[select]}
          onChange={(e) => {
            setSelect(e.target.value);
            handleSearch(e.target.value);
          }}
        >
          {cycles?.map((item: any, index: any) => (
            <SelectItem
              className={`${index === 0 ? "hidden" : ""}`}
              key={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
}
