"use client";

import { Button } from "@heroui/react";

export default function Register() {
  const handleButtonClick = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "omosh" }),
      });
      const result = await response.json();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="items-center p-10">
      <Button variant="ghost" onPress={handleButtonClick}>
        Regiser Urls
      </Button>
    </div>
  );
}
