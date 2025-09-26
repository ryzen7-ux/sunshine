import { generateToken } from "@/app/lib/mpesa/mpesa-actions";
import { NextResponse } from "next/server";

import type { NextApiRequest, NextApiResponse } from "next";

export async function POST() {
  const token = await generateToken();
  console.log(token);

  try {
    const requestBody = {
      ShortCode: 107031,
      CommandID: "CustomerPayBillOnline",
      amount: "50",
      MSISDN: "254705912645",
      BillRefNumber: "Test Group",
    };

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (data.ResponseDescription === "Success") {
      return Response.json({ status: "success", details: data });
    } else {
      console.log("Failed:", data);
      return Response.json({ status: "error", details: data });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ status: "error", details: "" });
  }
}
