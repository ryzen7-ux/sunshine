"use client";

import { addToast, Button } from "@heroui/react";
import React from "react";

export function SuccessToast({ success }: { success: string }) {
  React.useEffect(() => {
    if (success === "true") {
      addToast({
        title: "Success!",
        color: "success",
        variant: "solid",
        timeout: 10000,
        description: "Group created successfully",
      });
    }
  }, []);
  return <></>;
}

export function DeleteSuccessToast({ success }: { success: boolean }) {
  React.useEffect(() => {
    if (success === true) {
      addToast({
        title: "Success!",
        color: "warning",
        variant: "solid",
        timeout: 10000,
        description: "Group created successfully",
      });
    }
  }, []);
  return <></>;
}
