//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    return {
      ResultCode: "0",
      ResultDesc: "Accepted",
    };
  } catch (error) {
    error;
  }
  return NextResponse.json({ message: "success" });
}
