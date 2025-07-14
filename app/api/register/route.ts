import { generateToken } from "@/app/lib/mpesa/mpesa-actions";

export async function POST() {
  const tkn = await generateToken();
  console.log("token", tkn);
  try {
    const requestBody = {
      ShortCode: 600988,
      ResponseType: "Completed",
      ConfirmationURL:
        "https://b323-129-222-147-165.ngrok-free.app/api/confirmation",
      ValidationURL:
        "https://b323-129-222-147-165.ngrok-free.app/api/validation",
    };
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer `,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.ResponseDescription === "Success") {
      return Response.json({ status: "success", details: data });
    } else {
      console.log("Failed:", data);
      return Response.json({ status: "error", details: data });
    }
  } catch (error) {
    console.log(error);
  }
}
