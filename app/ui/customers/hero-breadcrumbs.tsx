"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function HeroBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs?: Breadcrumb[];
}) {
  return (
    <Breadcrumbs className="mb-4" color="secondary" size="lg">
      {breadcrumbs?.map((breadcrumb, index) => (
        <BreadcrumbItem key={index} startContent={breadcrumb.icon}>
          <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
