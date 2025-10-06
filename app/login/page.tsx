"use client";

import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { AcmeLogo } from "@/app/ui/navbar";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen pt-12">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col  p-4 md:-mt-32 pt-12">
        <div className="flex h-20 w-full items-end rounded-t-lg bg-green-800 p-3 md:h-24">
          <div className="flex items-center justify-center text-white">
            <AcmeLogo />
            <p className="font-bold text-xl text-white">
              Sunshine Jay Ventures
            </p>
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
