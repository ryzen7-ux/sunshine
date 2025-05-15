"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import Image from "next/image";
import { Button } from "@heroui/react";
import LandingNavbar from "@/app/ui/navbar";

export default function Page() {
  return (
    <>
    <LandingNavbar />
    <main className="flex min-h-screen flex-col md:p-6 p-2 bg-indigo-800" >
    
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg md:pl-20 p-4 py-10 md:w-3/5 md:px-5">
          <div className={styles.shape} />
          <p
            className={`text-xl text-white md:text-3xl md:leading-normal `}
          >
            <strong>Manage your retail business hassle-free using Magnet Retail’s POS system</strong>
          </p>
          
          <p className="text-sm text-white">
          Take advantage of the speed and efficiency of your device while enjoying all the functionality of a full-featured POS in an elegantly simple, design. Get the best retail POS system with all advanced features!
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-full bg-white px-6 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-indigo-400 hover:text-white md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-2/5 md:px-5 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/desktop.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
    </main>
    </>
  );
}
