"use client";

import { Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { HandCoins } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function RegionFilter({
  maxCycle,
  selectRegions,
}: {
  maxCycle: any;
  selectRegions: any;
}) {
  const cycles = [...Array(maxCycle[0].max ? maxCycle[0].max + 1 : 0)].map(
    (x, i) => ({
      value: String(i),
      label: `Cycle ${i}`,
    })
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("regionQuery", term);
    } else {
      params.delete("regionQuery");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 200);
  const [select, setSelect] = useState<any>("all");

  return (
    <>
      <div className=" w-full py-2">
        <Select
          size="sm"
          variant="faded"
          color="success"
          className="w-full "
          defaultSelectedKeys={[select]}
          endContent={<HandCoins className="text-green-700" />}
          placeholder="Regions"
          description={`Change to view region data for both groups and indiviudal loanees`}
          selectedKeys={[select]}
          onChange={(e) => {
            setSelect(e.target.value);
            handleSearch(e.target.value);
          }}
        >
          <SelectItem key="all">All Regions</SelectItem>
          {selectRegions.map((item: any, index: any) => (
            <SelectItem className={``} key={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
}
