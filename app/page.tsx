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

      <main className="flex min-h-screen flex-col bg-white mx-12">
        <div className=" flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col  gap-6 rounded-lg md:pl-20 px-4 py-12 md:my-4  md:w-3/5 md:px-5">
            {/* <div className={styles.shape} /> */}
            <p className={`text-xl  md:text-3xl md:leading-normal `}>
              <strong>Sunshine Jay Ventures ~</strong> Rising with you
            </p>

            <p className="text-sm ">
              Take advantage of the speed and efficiency of our services while
              enjoying all the benefits of our unique Financial management
              services
            </p>

            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-full bg-green-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-600 hover:text-white md:text-base"
            >
              <span>Get Started</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="flex items-center justify-center md:w-2/5 md:px-5 md:pb-12 md:mb-12">
            {/* Add Hero Images Here */}
            <Image
              src="/imac.png"
              width={490}
              height={470}
              className="hidden md:block"
              alt="Screenshots of the dashboard project showing desktop version"
            />
            <Image
              src="/imac.png"
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
