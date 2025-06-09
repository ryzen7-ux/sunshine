"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardFooter,
  CardBody,
  CardHeader,
  Alert,
} from "@heroui/react";

import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSimulate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setResult(null);

      const response = await fetch("/api/mpesa/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          amount: Number.parseFloat(amount),
          billReference: reference || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to simulate transaction"
        );
      }

      setResult(data);
      setSuccess("Transaction simulation initiated successfully!");
    } catch (err: any) {
      console.error("Simulation error:", err);
      setError(
        err.message || "An error occurred while simulating the transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStkPush = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setResult(null);

      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          amount: Number.parseFloat(amount),
          accountReference: reference || "Test",
          transactionDesc: "Payment",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to initiate STK Push"
        );
      }

      setResult(data);
      setSuccess("STK Push initiated successfully! Check your phone.");
    } catch (err: any) {
      console.error("STK Push error:", err);
      setError(err.message || "An error occurred while initiating STK Push");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUrls = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setResult(null);

      const response = await fetch("/api/mpesa/register-urls", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to register URLs"
        );
      }

      setResult(data);
      setSuccess("URLs registered successfully!");
    } catch (err: any) {
      console.error("Register URLs error:", err);
      setError(err.message || "An error occurred while registering URLs");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setResult(null);

      const response = await fetch("/api/mpesa/transactions");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch transactions");
      }

      setResult(data);
      setSuccess("Transactions fetched successfully!");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        M-Pesa API Integration
      </h1>

      <Card>
        <CardHeader>Simulate C2B Transaction</CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone">Phone Number (254XXXXXXXXX)</label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="254712345678"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="amount">Amount (KES)</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reference">Bill Reference (Optional)</label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="invoice123"
            />
          </div>
        </CardBody>
        <CardFooter>
          <Button
            onClick={handleSimulate}
            disabled={loading || !phoneNumber || !amount}
            className="w-full"
          >
            {loading ? "Processing..." : "Simulate Payment"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert className="mt-8 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <h1>Error</h1>
          <p>{error}</p>
        </Alert>
      )}

      {success && (
        <Alert className="mt-8 max-w-2xl mx-auto bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-green-800">Success</p>
          <p className="text-green-700">{success}</p>
        </Alert>
      )}

      {result && (
        <div className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
