export const generateToken = async () => {
  const auth = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch(
      `${process.env.MPESA_API_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to generate token");
    }
    const data = response;
    return data;
  } catch (error) {
    console.log(error);
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};
