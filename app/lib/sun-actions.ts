"use server";

import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import { redirect } from "next/navigation";
import { date, z } from "zod";
import sql from "@/app/lib/db";

const FormSchema = z.object({
  id: z.string(),
  reg: z.string().min(1, {
    message: "Please enter registration number",
  }),
  name: z.string().min(1, { message: "Please enter group name" }),
  location: z.string().min(1, { message: "Please enter location" }),
});

const MembersFormSchema = z.object({
  groupId: z.string(),
  idNumber: z.coerce.number().gt(0, { message: "Please enter a value." }),
  surname: z.string().min(1, { message: "Please enter  surname" }),
  firstName: z.string().min(1, { message: "Please enter a name" }),
  phone: z.string().min(1, { message: "Please enter a value" }),
  nature: z.string(),
  location: z.string().min(1, { message: "Please enter a value" }),
  id_front_name: z.string(),
  id_back_name: z.string(),
  passport_name: z.string(),
  doc_name: z.string(),
});

const LoanFormSchema = z.object({
  group_id: z.string(),
  member_id: z.string(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter a value greater than zero." }),
  loan_id: z.string(),
  interest: z.coerce
    .number()
    .gt(0, { message: "Please enter a value greater than zero." }),
  term: z.coerce
    .number()
    .gt(0, { message: "Please enter a value greater than zero." }),
  status: z.enum(["pending", "approved", "inactive", "rejected", "defered"], {
    invalid_type_error: "Please select a loan status.",
  }),
  notes: z.string(),
  date: z.string(),
});

const InvoiceFormSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than Ksh 0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateGroup = FormSchema.omit({
  id: true,
});
const UpdateGroup = FormSchema.omit({ id: true });

const CreateMembers = MembersFormSchema.omit({
  id_front_name: true,
  id_back_name: true,
  passport_name: true,
  doc_name: true,
});
const UpdateMember = MembersFormSchema.omit({ groupId: true });

const CreateLoan = LoanFormSchema.omit({ date: true, notes: true });
const UpdateLoan = LoanFormSchema.omit({
  member_id: true,
  group_id: true,
  date: true,
  notes: true,
});

const CreateGroupInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateGroupInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    reg?: string[];
    name?: string[];
    location?: string[];
  };
  message?: string | null;
};

export type MembersState = {
  errors?: {
    idNumber?: number[];
    surname?: string[];
    firstName?: string[];
    phone?: string[];
    location?: string[];
    id_front_name?: string[];
    id_back_name?: string[];
  };
  message?: string | null;
};

export type LoanState = {
  errors?: {
    amount?: string[];
    loan_id?: string[];
    interest?: string[];
    term?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type InvoiceState = {
  errors?: {
    groupId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type DeleteState = {
  message?: string | null;
};

export async function createGroup(prevState: State, formData: FormData) {
  const validatedFields = CreateGroup.safeParse({
    reg: formData.get("reg"),
    name: formData.get("name"),
    location: formData.get("location"),
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

  const { reg, name, location } = validatedFields.data;

  try {
    await sql`
        INSERT INTO groups (reg, name, location, date)
        VALUES (${reg}, ${name}, ${location}, ${localDate})
      `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
      err: error,
    };
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers?success=true");
}

export async function updateGroup(id: string, formData: FormData) {
  const { reg, name, location } = UpdateGroup.parse({
    reg: formData.get("reg"),
    name: formData.get("name"),
    location: formData.get("location"),
  });

  try {
    await sql`
        UPDATE groups
        SET reg = ${reg}, name = ${name}, location = ${location}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteGroup(prevState, formData: FormData) {
  const id = formData.get("id");

  try {
    await sql`DELETE FROM members WHERE groupid = ${id}`;
    await sql`DELETE FROM groups WHERE id = ${id}`;
    await sql`DELETE FROM groupinvoice WHERE group_id = ${id}`;
  } catch (error) {}

  revalidatePath("/dashboard/customers");
}
// Members
export async function createMembers(
  prevState: MembersState,
  formData: FormData
) {
  const validatedFields = CreateMembers.safeParse({
    groupId: formData.get("groupId"),
    idNumber: formData.get("idNumber"),
    surname: formData.get("surname"),
    firstName: formData.get("firstName"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    nature: formData.get("nature"),
  });

  const utcDate = new Date(); // UTC time
  const offset = utcDate.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(utcDate.getTime() - offset);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Member.",
    };
  }

  const { groupId, idNumber, surname, firstName, phone, location, nature } =
    validatedFields.data;
  console.log(groupId, idNumber, surname, firstName, phone, location);
  try {
    await sql`
        INSERT INTO members (groupid, idnumber, surname, firstname, phone, location, nature, date)
        VALUES (${groupId}, ${idNumber}, ${surname}, ${firstName}, ${phone}, ${location}, ${nature}, ${localDate})
      `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
      err: error,
    };
  }
  revalidatePath(`/dashboard/customers/${groupId}/details`);
  redirect(`/dashboard/customers/${groupId}/details`);
}

export async function updateMember(mid: string, formData: FormData) {
  const {
    idNumber,
    surname,
    firstName,
    phone,
    location,
    nature,
    id_front_name,
    id_back_name,
    passport_name,
    doc_name,
  } = UpdateMember.parse({
    idNumber: formData.get("idNumber"),
    surname: formData.get("surname"),
    firstName: formData.get("firstName"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    nature: formData.get("nature"),
    id_front_name: formData.get("id_front_name"),
    id_back_name: formData.get("id_back_name"),
    passport_name: formData.get("passport_name"),
    doc_name: formData.get("doc_name"),
  });

  const id = formData.get("groupId");

  // File logic
  const id_front_file = formData.get("id_front") as File;
  const id_back_file = formData.get("id_back") as File;
  const passport_file = formData.get("passport") as File;
  const doc_file = formData.get("doc") as File;

  const arrayBuffer1 = await id_front_file.arrayBuffer();
  const arrayBuffer2 = await id_back_file.arrayBuffer();
  const arrayBuffer3 = await passport_file.arrayBuffer();
  const arrayBuffer4 = await doc_file.arrayBuffer();

  const buffer = new Uint8Array(arrayBuffer1);
  const buffer2 = new Uint8Array(arrayBuffer2);
  const buffer3 = new Uint8Array(arrayBuffer3);
  const buffer4 = new Uint8Array(arrayBuffer4);

  let id_front = `id-front-${mid}-${id_front_file.name}`;
  let id_back = `id-back-${mid}-${id_back_file.name}`;
  let passport = `passport-${mid}-${passport_file.name}`;
  let doc = `doc-${mid}-${doc_file.name}`;

  if (id_front_file.name === "undefined") {
    id_front = id_front_name;
  }

  if (id_back_file.name === "undefined") {
    id_back = id_back_name;
  }

  if (passport_file.name === "undefined") {
    passport = passport_name;
  }
  if (doc_file.name === "undefined") {
    doc = doc_name;
  }

  try {
    await sql`
        UPDATE members
        SET idnumber = ${idNumber}, surname = ${surname}, firstname= ${firstName}, phone=${phone}, location = ${location}, nature = ${nature}, id_front = ${id_front}, id_back = ${id_back}, passport = ${passport}, doc = ${doc}
        WHERE id = ${mid}
      `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }
  if (id_front_file.name !== "undefined") {
    await fs.writeFile(
      `./public/uploads/id-front-${mid}-${id_front_file.name}`,
      buffer
    );
  }
  if (id_back_file.name !== "undefined") {
    await fs.writeFile(
      `./public/uploads/id-back-${mid}-${id_back_file.name}`,
      buffer2
    );
  }
  if (passport_file.name !== "undefined") {
    await fs.writeFile(
      `./public/uploads/passport-${mid}-${passport_file.name}`,
      buffer3
    );
  }
  if (doc_file.name !== "undefined") {
    await fs.writeFile(`./public/uploads/doc-${mid}-${doc_file.name}`, buffer4);
  }
  revalidatePath(`/dashboard/customers/${id}/details`);
  redirect(`/dashboard/customers/${id}/details`);
}

export async function deleteMember(id: string, gid: string) {
  await sql`DELETE FROM loans WHERE memberid = ${id}`;
  await sql`DELETE FROM members WHERE id = ${id}`;
  revalidatePath(`/dashboard/customers/${gid}/details`);
}

export async function createLoan(prevState: LoanState, formData: FormData) {
  const validatedFields = CreateLoan.safeParse({
    group_id: formData.get("group_id"),
    member_id: formData.get("member_id"),
    amount: formData.get("amount"),
    loan_id: formData.get("loan_id"),
    interest: formData.get("interest"),
    term: formData.get("term"),
    status: formData.get("status"),
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
  const { group_id, member_id, amount, loan_id, interest, term, status } =
    validatedFields.data;

  try {
    await sql`
      INSERT INTO loans (groupid, memberid, amount, loanid, interest, term, status, date)
      VALUES (${group_id}, ${member_id}, ${amount}, ${loan_id}, ${interest}, ${term}, ${status}, ${localDate})
    `;
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }
  revalidatePath(`/dashboard/loans`);
  redirect(`/dashboard/loans`);
}

export async function updateLoan(id: string, formData: FormData) {
  const { amount, loan_id, interest, term, status } = UpdateLoan.parse({
    amount: formData.get("amount"),
    loan_id: formData.get("loan_id"),
    interest: formData.get("interest"),
    term: formData.get("term"),
    status: formData.get("status"),
  });
  const date = formData.get("start_date");
  const newDate = date.split("T")[0];
  const notes = formData.get("notes");
  try {
    await sql`
      UPDATE loans
      SET amount = ${amount}, loanid = ${loan_id}, interest = ${interest}, term = ${term}, status = ${status}, start_date=${newDate}, notes=${notes}
      WHERE id= ${id}
    `;
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Update Loan.",
    };
  }
  revalidatePath("/dashboard/loans");
  redirect("/dashboard/loans");
}

export async function deleteLoan(id: string) {
  await sql`DELETE FROM loans WHERE id = ${id}`;
  revalidatePath("/dashboard/loans");
}

export async function createGroupInvoice(
  prevState: InvoiceState,
  formData: FormData
) {
  const validatedFields = CreateGroupInvoice.safeParse({
    groupId: formData.get("groupId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  const { groupId, amount, status } = validatedFields.data;

  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO groupinvoice (group_id, amount, status, date)
      VALUES (${groupId}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateGroupInvoice(id: string, formData: FormData) {
  const { amount, status } = UpdateGroupInvoice.parse({
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  try {
    await sql`
        UPDATE groupinvoice
        SET  amount = ${amount}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteGroupInvoice(id: string) {
  try {
    await sql`DELETE FROM groupinvoice WHERE id = ${id}`;
    console.log("Deleted invoice with ID:", id);
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath("/dashboard/invoices");
}
