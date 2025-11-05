import bcrypt from "bcryptjs";
import postgres from "postgres";
import {
  invoices,
  customers,
  revenue,
  users,
  invoicees,
  groups,
  members,
  loans,
  ginvoices,
} from "../lib/placeholder-data";
import sql from "@/app/lib/db";

async function seedUsers() {
  const password: string = "pass1234";
  const hashedPassword = await bcrypt.hash(password, 10);
  const created = new Date();
  const admin =
    await sql`INSERT INTO users (name, email, phone, role, status, password, created) 
    VALUES ('henry-admin','henryomosh7@gmail.com', '0708663296', 'admin', 'active', ${hashedPassword}, ${created})`;
  console.log(admin);

  // await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  // await sql`
  //   CREATE TABLE IF NOT EXISTS users (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     email TEXT NOT NULL UNIQUE,
  //     phone VARCHAR(255),
  //     role VARCHAR(255) NOT NULL,
  //     status VARCHAR(255) NOT NULL,
  //     password TEXT NOT NULL,
  //     created TIMESTAMPTZ NOT NULL
  //   );
  // `;

  return;
}

async function seedRegions() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS regions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      manager UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      county VARCHAR(255) NOT NULL,
      created TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedIndividuals() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS individuals (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      region UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      idnumber BIGINT NOT NULL UNIQUE,
      phone VARCHAR(255) NOT NULL,
      business VARCHAR(255) NOT NULL,
      created TIMESTAMPTZ NOT NULL,
      id_front TEXT,
      id_back TEXT,
      passport TEXT,
      doc TEXT
    );
  `;
}

async function seedIndividualLoans() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS individuals_loans (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      region UUID NOT NULL,
      loanee UUID NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      interest NUMERIC(10, 2) NOT NULL,
      term NUMERIC(10, 2) NOT NULL,
      status VARCHAR(255) NOT NULL,
      fee BIGINT,
      cycle INT,
      start_date TIMESTAMPTZ,
      created TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;
}

async function seedInvoicees() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS invoicees (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      invoiceNumber VARCHAR(255) NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      quantity INT NOT NULL,
      price INT NOT NULL,
      tax INT NOT NULL,
      payment VARCHAR(255) NOT NULL
    );
  `;
}

async function seedGroups() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS groups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      region UUID NOT NULL,
      reg VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      date TIMESTAMPTZ NOT NULL
    
    );
  `;
}

async function seedMembers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS members (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      groupId VARCHAR(255) NOT NULL,
      idNumber INT NOT NULL,
      surname VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      nature VARCHAR(5000),
      location VARCHAR(255) NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      id_front TEXT,
      id_back TEXT,
      passport TEXT,
      doc TEXT
    );
  `;
}

async function seedLoans() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS loans (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      groupid UUID NOT NULL,
      memberid UUID NOT NULL,
      amount INT NOT NULL,
      loanid VARCHAR(255),
      interest FLOAT NOT NULL,
      term INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      start_date TIMESTAMPTZ,
      cycle INT,
      fee BIGINT,
      notes VARCHAR(10000),
      date TIMESTAMPTZ NOT NULL
    );
  `;
}

async function seedGroupInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS groupinvoice (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      group_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
}

async function seedMpesaInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS mpesainvoice (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      first_name VARCHAR(255),
      middle_name VARCHAR(255),
      last_name VARCHAR(255),
      phone_number VARCHAR(255),
      transid VARCHAR(255),
      transtime TIMESTAMPTZ,
      transamount INT,
      cycle INT,
      refnumber VARCHAR(255)
    );
  `;
}
export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      // seedUsers(),
      seedRegions(),
      seedIndividuals(),
      seedIndividualLoans(),
      seedInvoices(),
      seedCustomers(),
      seedRevenue(),
      seedInvoicees(),
      seedGroups(),
      seedMembers(),
      seedLoans(),
      seedGroupInvoices(),
      seedMpesaInvoices(),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
