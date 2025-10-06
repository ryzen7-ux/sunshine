"use server";

import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import { redirect } from "next/navigation";
import { date, z } from "zod";
import sql from "@/app/lib/db";
import {
  fetchUserByEmail,
  fetchUserById,
  fetchIndividualsByIdNumber,
  fetchIndividualById,
} from "@/app/lib/sun-data";
import bcrypt from "bcryptjs";
import { inter } from "../ui/fonts";

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

export async function createStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const password = formData.get("password") as string;

  console.log(password);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await fetchUserByEmail(email);
  const created = new Date();

  if (user?.length !== 0) {
    return { success: false, message: "A user with that email exist!" };
  }
  try {
    await sql`INSERT INTO users (name, email, phone, role, status, password, created) 
    VALUES (${name}, ${email}, ${phone}, ${role}, ${status}, ${hashedPassword}, ${created})`;

    revalidatePath("/dashboard/staff-management");
    return { success: true, message: "Staff created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function updateStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  let password = formData.get("password") as string;
  const id = formData.get("id") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await fetchUserById(id);
  const usr = user!;

  if (email !== String(usr[0]?.email)) {
    const userEmail = await fetchUserByEmail(email);
    if (userEmail?.length !== 0) {
      return { success: false, message: "A user with that email exist!" };
    }
  }

  if (password !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;
  }

  try {
    await sql`UPDATE users SET name =${name} , email =${email}, phone =${phone}, role = ${role}, status = ${status}, password =${password}
   WHERE id= ${id}`;

    revalidatePath("/dashboard/staff-management");
    return { success: true, message: "Staff updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function deleteStaff(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath("/dashboard/staff-management");
    return { success: false, message: "Member deleted!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Some error occured" };
  }
}

// REGIONS
export async function createRegion(formData: FormData) {
  const name = formData.get("name") as string;
  const county = formData.get("county") as string;
  const manager = formData.get("manager") as string;

  const created = new Date();

  try {
    await sql`INSERT INTO regions (name, county, manager,created) 
    VALUES (${name}, ${county}, ${manager}, ${created})`;

    revalidatePath("/dashboard/staff-management");
    return { success: true, message: "Region created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function updateRegion(formData: FormData) {
  const name = formData.get("name") as string;
  const county = formData.get("county") as string;
  const manager = formData.get("manager") as string;
  const id = formData.get("id") as string;

  try {
    await sql`UPDATE regions SET name = ${name}, county = ${county}, manager = ${manager} WHERE id=${id}`;

    revalidatePath("/dashboard/staff-management");
    return { success: true, message: "Region update successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function deleteRegion(id: string) {
  try {
    await sql`DELETE FROM regions WHERE id = ${id}`;
    revalidatePath("/dashboard/staff-management");
    return { success: true, message: "Region deleted!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Some error occured" };
  }
}

// INDIVIDUALS

export async function createIndividual(formData: FormData) {
  const name = formData.get("name") as string;
  const idNumber = formData.get("idNumber") as string;
  const phone = formData.get("phone") as string;
  const region = formData.get("region") as string;
  const business = formData.get("business") as string;

  const created = new Date();
  const newIdNumber = Number(idNumber);
  const individuals = await fetchIndividualsByIdNumber(newIdNumber);
  if (individuals?.length !== 0) {
    return { success: false, message: "ID number already exists" };
  }

  try {
    await sql`INSERT INTO individuals (name, idnumber, phone, region, business, created)
    VALUES (${name}, ${newIdNumber}, ${phone}, ${region}, ${business}, ${created})`;
    revalidatePath("/dashboard/individuals");
    return { success: true, message: "Loanee created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function updateIndividual(formData: FormData) {
  const name = formData.get("name") as string;
  const idNumber = formData.get("idNumber") as string;
  const phone = formData.get("phone") as string;
  const region = formData.get("region") as string;
  const business = formData.get("business") as string;
  const id = formData.get("id") as string;

  const newIdNumber = Number(idNumber);
  const individual = await fetchIndividualById(id);
  const individualByIdNumber = await fetchIndividualsByIdNumber(newIdNumber);

  const indv = individual!;
  console.log(id);
  if (individualByIdNumber?.length !== 0 && indv[0]?.idnumber !== idNumber) {
    return { success: false, message: "ID number already exists" };
  }

  try {
    await sql`UPDATE individuals SET name=${name}, idnumber=${newIdNumber}, phone=${phone}, region=${region}, business=${business}
    WHERE id=${id}`;

    revalidatePath("/dashboard/individuals");
    return { success: true, message: "Loanee updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function deleteIndividual(id: string) {
  try {
    await sql`DELETE FROM individuals WHERE id = ${id}`;
    revalidatePath("/dashboard/individuals");
    return { success: true, message: "Indivudal deleted!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Some error occured" };
  }
}

export async function createIndividualLoan(formData: FormData) {
  const region = formData.get("region") as string;
  const loannee = formData.get("loanee") as string;
  const amount = formData.get("amount") as unknown;
  const interest = formData.get("interest") as unknown;
  const term = formData.get("term") as unknown;
  const status = formData.get("status") as string;

  const created = new Date();
  if (status === null) {
    return { success: false, message: "Please select loan status!" };
  }

  if (Number(amount) > 50000000) {
    return { success: false, message: "Invalid amount!" };
  }

  try {
    await sql`INSERT INTO individuals_loans (region, loanee, amount, interest, term, status, created)
    VALUES (${region}, ${loannee}, ${Number(amount)}, ${Number(
      interest
    )}, ${Number(term)},${status}, ${created})`;

    revalidatePath("/dashboard/individuals");
    return { success: true, message: "Loan created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function updateIndividualLoan(formData: FormData) {
  const id = formData.get("id") as string;
  const amount = formData.get("amount") as unknown;
  const interest = formData.get("interest") as unknown;
  const term = formData.get("term") as unknown;
  const status = formData.get("term") as string;

  if (Number(amount) > 50000000) {
    return { success: false, message: "Invalid amount!" };
  }

  try {
    await sql`UPDATE  individuals_loans SET amount = ${Number(
      amount
    )} , interest = ${Number(interest)}, term = ${Number(
      term
    )}, status = ${status} WHERE id = ${id}`;

    revalidatePath("/dashboard/individuals");
    return { success: true, message: "Loan Updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function deleteIndividualLoan(id: string) {
  try {
    await sql`DELETE FROM individuals_loans WHERE id = ${id}`;
    revalidatePath("/dashboard/individuals");
    return { success: true, message: "Item deleted" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}
// GROUPS
export async function createGroup(formData: FormData) {
  const reg = formData.get("reg") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const region = formData.get("region") as string;

  const utcDate = new Date(); // UTC time
  const offset = utcDate.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(utcDate.getTime() - offset);

  try {
    await sql`
        INSERT INTO groups (reg, name, location, date, region)
        VALUES (${reg}, ${name}, ${location}, ${localDate}, ${region})
      `;
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Group created successfuly!" };
  } catch (error) {
    return {
      success: false,
      message: "Database Error: Failed to Create Group.",
    };
  }
}

export async function updateGroup(formData: FormData) {
  const reg = formData.get("reg") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const region = formData.get("region") as string;
  const id = formData.get("id") as string;
  console.log(formData);
  try {
    await sql`
        UPDATE groups
        SET reg = ${reg}, name = ${name}, location = ${location}, region= ${region}
        WHERE id = ${id}
      `;
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Group updated successfulluy" };
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
    return { success: false, message: "Failed to update group" };
  }
}

export async function deleteGroup(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;

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

// LOANS
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

  const localDate = new Date();

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
    amount: formData.get("amount") as unknown,
    loan_id: formData.get("loan_id") as string,
    interest: formData.get("interest") as unknown,
    term: formData.get("term") as unknown,
    status: formData.get("status") as unknown,
  });
  const date = formData.get("start_date") as string;
  const newDate = date?.split("T")[0];
  const notes = formData.get("notes") as string;
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
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }

  revalidatePath("/dashboard/invoices");
}

// MPESA

export async function updateMpesaInvoice(formData: FormData) {
  const refNumber = formData.get("group") as string;
  const id = formData.get("id") as string;
  try {
    await sql`UPDATE mpesainvoice SET refnumber = ${refNumber} WHERE id=${id}`;
    revalidatePath("dashboard/mpesa");
    return { success: true, message: "Transaction updated" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error occured" };
  }
}

export async function deleteMpesaInvoice(id: string) {
  try {
    await sql`DELETE FROM mpesainvoice WHERE id = ${id}`;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }
  revalidatePath("/dashboard/mpesa");
}
