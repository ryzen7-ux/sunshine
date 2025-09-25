export const generateToken = async () => {
  const auth = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch(
      `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Auth request from safaricom failed with status ${response.status}`
      );
    }
    const data = await response.json();

    return data?.access_token;
  } catch (error) {
    console.log(error);
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};
