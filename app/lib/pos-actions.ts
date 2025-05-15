"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import sql from "@/app/lib/db";

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  invoiceNumber: z.string(),
  quantity: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  price: z.coerce.number(),
  tax: z.coerce.number(),
  date: z.string(),
  payment: z.enum(["cash", "mpesa"], {
    invalid_type_error: "Please select a payment method.",
  }),
});

const CreateInvoice = FormSchema.omit({
  id: true,
  date: true,
});
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    invoiceNumber?: string[];
    quantity?: string[];
    price?: string[];
    payment?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    name: formData.get("name"),
    invoiceNumber: formData.get("invoiceNumber"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    tax: formData.get("tax"),
    payment: formData.get("payment"),
  });

  const utcDate = new Date(); // UTC time
  const offset = utcDate.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(utcDate.getTime() - offset);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  const { name, invoiceNumber, quantity, price, tax, payment } =
    validatedFields.data;
  console.log(name, invoiceNumber, quantity, price, tax, payment);

  try {
    await sql`
        INSERT INTO invoicees (name, invoiceNumber, date, quantity, price, tax, payment)
        VALUES (${name}, ${invoiceNumber}, ${localDate}, ${quantity}, ${price}, ${tax}, ${payment})
      `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  revalidatePath("/dashboard/sell");
  redirect("/dashboard/sell");
}
