"use client";

import React from "react";
import { Pagination } from "@heroui/react";
import { redirect, usePathname, useSearchParams } from "next/navigation";

export default function GroupPagination({
  totalPages,
}: {
  totalPages: number;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination
      showControls
      size="lg"
      color="success"
      page={currentPage}
      total={totalPages}
      onChange={(page) => {
        setCurrentPage(page);
        redirect(createPageURL(page));
      }}
    />
  );
}
