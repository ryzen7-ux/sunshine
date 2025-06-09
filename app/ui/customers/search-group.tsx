"use client";

import { Input, Link } from "@heroui/react";
import { Search, Plus } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchGroup() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="py-4 flex gap-4">
      <Input
        placeholder="Search group...."
        radius="lg"
        size="md"
        variant="faded"
        color="success"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        startContent={<Search className="h-6 w-6 text-gray-600" />}
      />
      <Link
        href="/dashboard/customers/create"
        className="flex h-10 md:w-48 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <span className="hidden md:block">Create Group</span>{" "}
        <Plus className="h-5 md:ml-4" />
      </Link>
    </div>
  );
}
