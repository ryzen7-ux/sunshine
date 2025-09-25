import sql from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const res = await request.json();

  const transID = res.TransID ?? "";
  const transTime = res.TransTime ?? "";
  const transAmount = Number(res.TransAmount ?? "0");
  const refNumber = res.BillRefNumber ?? "";
  const dateString = transTime; // YYYYMMDD format
  const year = parseInt(dateString.substring(0, 4));

  // Month is 0-indexed in JavaScript Date objects, so subtract 1
  const month = parseInt(dateString.substring(4, 6)) - 1;
  const day = parseInt(dateString.substring(6, 8));
  const hour = parseInt(dateString.substring(8, 10));
  const minute = parseInt(dateString.substring(10, 12));
  const second = parseInt(dateString.substring(12, 14));

  const dateObject = new Date(year, month, day, hour, minute);

  try {
    await sql`
      INSERT INTO mpesainvoice (transid, transtime, transamount, refnumber)
      VALUES (${transID}, ${dateObject}, ${transAmount}, ${refNumber})
    `;
  } catch (error) {
    return NextResponse.json({
      message: "Database Error: Failed to Create Invoice.",
    });
  }

  return NextResponse.json({ message: "success" });
}
