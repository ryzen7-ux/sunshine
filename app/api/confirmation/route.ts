//@ts-nocheck

import sql from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { decodeMsisdnValue } from "@/app/lib/utils";

export async function POST(request: NextRequest) {
  const res = await request.json();

  const transID = res.TransID ?? "";
  const transTime = res.TransTime ?? "";
  const transAmount = Number(res.TransAmount ?? "0");
  const refNumber = res.BillRefNumber ?? "";
  const dateString = transTime; // YYYYMMDD format

  const firstName = res.FirstName ?? "";
  const middleName = res.MiddleName ?? "";
  const lastName = res.LastName ?? "";
  const number = res.MSISDN ?? "";

  const year = parseInt(dateString.substring(0, 4));
  // Month is 0-indexed in JavaScript Date objects, so subtract 1
  const month = parseInt(dateString.substring(4, 6));
  const day = parseInt(dateString.substring(6, 8));
  const hour = parseInt(dateString.substring(8, 10));
  const minute = parseInt(dateString.substring(10, 12));
  const second = parseInt(dateString.substring(12, 14));

  const dt = DateTime.fromObject(
    { year, month, day, hour, minute },
    { zone: "Africa/Nairobi" }
  );

  const dateObject = dt.toISO();

  const num = await decodeMsisdnValue(number);
  const phoneNumber = num?.msisdn ?? "null";
  const cycle: any = 0;
  try {
    await sql`
      INSERT INTO mpesainvoice (transid, transtime, transamount, refnumber, first_name, middle_name, last_name, phone_number, cycle)
      VALUES (${transID}, ${dateObject}, ${transAmount}, ${refNumber}, ${firstName},  ${middleName}, ${lastName}, ${phoneNumber}, ${cycle})
    `;
  } catch (error) {
    return NextResponse.json({
      message: "Database Error: Failed to Create Invoice.",
    });
  }

  return NextResponse.json({ message: "success" });
}
