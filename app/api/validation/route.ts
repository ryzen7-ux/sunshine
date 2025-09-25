//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
  } catch (error) {
    return NextResponse.json({ message: "some error occured" });
  }
  return NextResponse.json({
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
}
