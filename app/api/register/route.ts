import { generateToken } from "@/app/lib/mpesa/mpesa-actions";
import { NextResponse } from "next/server";

import type { NextApiRequest, NextApiResponse } from "next";

export async function POST() {
  const token = await generateToken();
  console.log(token);

  try {
    const requestBody = {
      ShortCode: 600989,
      ResponseType: "Completed",
      ConfirmationURL: "https://1969da5fe22d.ngrok-free.app/api/confirmation",
      ValidationURL: "https://1969da5fe22d.ngrok-free.app/api/validation",
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
