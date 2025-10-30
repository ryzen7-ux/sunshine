"use client";

import { Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { HandCoins } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function DisbursementCycle({ maxCycle }: { maxCycle: any }) {
  const cycles = [...Array(maxCycle[0].max + 1)].map((x, i) => ({
    value: String(i),
    label: `Cycle ${i}`,
  }));
  cycles.push({ value: "all", label: "All" });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 200);
  const [select, setSelect] = useState<any>(String(maxCycle[0].max ?? 0));

  return (
    <>
      <div className="py-4 w-full">
        <Select
          size="sm"
          color="success"
          className="w-full border border-green-500 rounded-md p-4 "
          defaultSelectedKeys={["cat"]}
          endContent={<HandCoins />}
          label="Disbursement Cycle"
          labelPlacement="inside"
          placeholder=""
          description={`Change to view other cycles. Latest disbursement: Cycle ${maxCycle[0].max}`}
          selectedKeys={[select]}
          onChange={(e) => {
            setSelect(e.target.value);
            handleSearch(e.target.value);
          }}
        >
          {cycles.map((item, index) => (
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
