"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AppProvider } from "@/app/app-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <AppProvider>{children}</AppProvider>
    </HeroUIProvider>
  );
}
