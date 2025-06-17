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
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
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

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedInvoices;
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

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );

  return insertedRevenue;
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

  // const insertedInvoices = await Promise.all(
  //   invoicees.map(
  //     (invoice) => sql`
  //       INSERT INTO invoicees (name, invoiceNumber, date, quantity, price, tax, payment)
  //       VALUES (${invoice.name},${invoice.invoiceNumber}, ${invoice.date}, ${invoice.quantity}, ${invoice.price}, ${invoice.tax}, ${invoice.payment})
  //       ON CONFLICT (id) DO NOTHING;
  //     `
  //   )
  // );

  // return insertedInvoices;
}

async function seedGroups() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
  CREATE TABLE IF NOT EXISTS groups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      reg VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      date TIMESTAMPTZ NOT NULL
    
    );
  `;

  // const insertedGroups = await Promise.all(
  //   groups.map(
  //     (group) => sql`
  //       INSERT INTO groups (reg, name, location, date)
  //       VALUES (${group.reg},${group.name}, ${group.location}, ${group.date})
  //       ON CONFLICT (id) DO NOTHING;
  //     `
  //   )
  // );

  // return insertedGroups;
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
      id_front VARCHAR(255),
      id_back VARCHAR(255),
      passport VARCHAR(255),
      doc VARCHAR(255)
    );
  `;

  // const insertedGroups = await Promise.all(
  //   members.map(
  //     (member) => sql`
  //       INSERT INTO members (groupId, idNumber, surname, firstName, phone, location, date)
  //       VALUES (${member.groupId}, ${member.idNumber}, ${member.surname}, ${member.firstName}, ${member.phone}, ${member.location}, ${member.date})
  //       ON CONFLICT (id) DO NOTHING;
  //     `
  //   )
  // );

  // return insertedGroups;
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
      start_date DATE,
      notes VARCHAR(10000),
      date TIMESTAMP NOT NULL
    );
  `;

  // const insertedLoans = await Promise.all(
  //   loans.map(
  //     (loan) => sql`
  //       INSERT INTO loans (groupid, memberid, amount, loanid, interest, term, status, date)
  //       VALUES (${loan.groupid}, ${loan.memberid}, ${loan.amount}, ${loan.loanid}, ${loan.interest}, ${loan.term}, ${loan.status}, ${loan.date})
  //       ON CONFLICT (id) DO NOTHING;
  //     `
  //   )
  // );

  // return insertedLoans;
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

  // const insertedInvoices = await Promise.all(
  //   ginvoices.map(
  //     (invoice) => sql`
  //       INSERT INTO groupinvoice (group_id, amount, status, date)
  //       VALUES (${invoice.group_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
  //       ON CONFLICT (id) DO NOTHING;
  //     `
  //   )
  // );

  // return insertedInvoices;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedUsers(),
      seedInvoices(),
      seedCustomers(),
      seedRevenue(),
      // seedInvoicees(),
      seedGroups(),
      seedMembers(),
      seedLoans(),
      seedGroupInvoices(),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
