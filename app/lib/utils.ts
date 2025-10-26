//@ts-nocheck

import { Revenue } from "./definitions";
import { decodeMsisdn, fetchHashed } from "mpesa-hash-decoder";
import axios from "axios";
import { parseZonedDateTime } from "@internationalized/date";

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
export const formatCurrencyToLocal = (
  amount: number,
  locale: string = "en-KE"
) => {
  return amount?.toLocaleString(locale, {
    style: "currency",
    currency: "KES",
  });
};

export const formatFormDateTime = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const isoTime: any = new Date(dateStr)?.toLocaleDateString("fr-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isoTime2 = new Date(dateStr)?.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  });

  const formatedDateTime = `${isoTime}T${isoTime2}[Africa/Nairobi]`;

  return parseZonedDateTime(formatedDateTime);
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    minute: "numeric",
    hour: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter?.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

class DecodeHashResponseModel {
  constructor(msisdn = null, hash = null, success = false, detail = null) {
    this.msisdn = msisdn;
    this.hash = hash;
    this.success = success;
    this.detail = detail;
  }
}

const SERVER = "https://decodehash.com";
const DECODEHASH_END_POINT = "/app/api/v1/decode-hash/free/";

export async function decodeMsisdnValue(hashStr: string) {
  const url = `${SERVER}${DECODEHASH_END_POINT}${hashStr}`;
  const headers = { Accept: "application/json" };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data;

    const decodeHashResponseModel = new DecodeHashResponseModel(
      data.msisdn,
      data.hash,
      "msisdn" in data, // Determine success based on available data
      data.detail
    );

    return decodeHashResponseModel;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return new DecodeHashResponseModel();
  }
}

export const formatPhoneNumber = (number: string) => {
  if (number?.startsWith("254") || number?.startsWith("+254")) {
    const remainingString = number?.slice(3, 15);
    const newString = "0" + remainingString;
    return newString;
  }
  return number;
};

export const computeTotalLoan = (
  amount: number,
  interest: number,
  term: number
) => {
  const rate = interest / 100 / 4;
  const wpay = Math.ceil(amount / term + amount * rate);
  const payment = Math.ceil(wpay * term);
  return Math.trunc(payment);
};
