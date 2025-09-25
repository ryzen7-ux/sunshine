//@ts-nocheck
import { generateToken } from "@/app/lib/mpesa/mpesa-actions";
import { NextResponse } from "next/server";

import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(request: Request) {
  const token = await generateToken();

  try {
    const requestBody = {
      ShortCode: 600983,
      ResponseType: "Completed",
      ConfirmationURL: "https://25ee7bd48a37.ngrok-free.app/api/confirmation",
      ValidationURL: "https://25ee7bd48a37.ngrok-free.app/api/validation",
    };

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
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
