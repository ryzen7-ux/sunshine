import sql from "@/app/lib/db";
import {
  GroupsTable,
  GroupForm,
  MembersTable,
  MemberForm,
  LoanForm,
  InvoicesTable,
  InvoicesForm,
  LatestInvoice,
} from "./sun-defination";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredGroups(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const groups = await sql<GroupsTable[]>`
      SELECT
        groups.id,
        groups.reg,
        groups.name,
        groups.location,
        groups.date , 
        COUNT (members.id) AS members_count,
        SUM(CASE WHEN loans.status = 'approved' THEN loans.amount ELSE 0 END) AS disbursed
      FROM groups
      LEFT JOIN members ON groups.id:: text = members.groupid
      LEFT JOIN loans ON groups.id = loans.groupid
      WHERE
        groups.reg ILIKE ${`%${query}%`} OR
        groups.name ILIKE ${`%${query}%`} OR
        groups.location ILIKE ${`%${query}%`} OR
        groups.date::text ILIKE ${`%${query}%`}
      GROUP BY groups.id
      ORDER BY groups.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return groups;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchGroupPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM groups
  `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchGroupMembers(query: string) {
  try {
    const members = await sql`SELECT 
    members.id,
    CONCAT_WS(' ', members.firstname, members.surname) AS name
    FROM members
    WHERE
      members.groupid = ${query} 
    ORDER BY members.date DESC
  `;
    return members;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchGroupById(id: string) {
  try {
    const data = await sql<GroupForm[]>`
      SELECT
        groups.id,
        groups.reg,
        groups.name,
        groups.location  
      FROM groups
      WHERE groups.id = ${id};
    `;

    const group = data.map((group) => ({
      ...group,
      // Convert amount from cents to dollars
    }));

    return group[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchGroups() {
  try {
    const groups = await sql<GroupForm[]>`
      SELECT *
      FROM groups
      ORDER BY groups.name ASC
    `;
    return groups;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchMembers(id: string) {
  try {
    const data = await sql<MembersTable[]>`
      SELECT
        members.id,
        members.groupId,
        members.idNumber,
        members.surname,
        members.firstName,
        members.phone,
        members.location,
        members.nature,
        members.id_front,
        members.id_back,
        members.passport,
        members.doc
      FROM members
      WHERE members.groupId = ${id}
      ORDER BY members.date DESC
    `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchMemberById(mid: string) {
  try {
    const data = await sql<MemberForm[]>`
      SELECT
        members.id,
        members.groupId,
        members.idNumber,
        members.surname,
        members.firstName,
        members.phone,
        members.location,
        members.nature,
        members.id_front,
        members.id_back,
        members.passport,
        members.doc
      FROM members
      WHERE members.id = ${mid};
    `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchLoanById(mid: string) {
  try {
    const data = await sql<LoanForm[]>`
      SELECT
        loans.id,
        loans.memberid,
        loans.loanid,
        loans.amount,
        loans.interest,
        loans.term,
        loans.date,
        loans.status,
        loans.notes,
        loans.start_date,
        loans.start_date + (COALESCE(loans.term, 0) * INTERVAL '1 week') AS end_date,
        (EXTRACT(days FROM (now() - loans.start_date)) / 7)::int as today,
        (EXTRACT(days FROM (now() - loans.start_date)))::int as past_days
      FROM loans
      WHERE loans.memberid = ${mid}
      ORDER BY loans.date DESC
      LIMIT 1
      
    `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}
export async function fetchLoanByIdNew(id: string) {
  try {
    const data = await sql<LoanForm[]>`
      SELECT
        loans.id,
        loans.memberid,
        loans.loanid,
        loans.amount,
        loans.interest,
        loans.term,
        loans.date,
        loans.status,
        loans.start_date,
        loans.notes,
        members.surname,
        members.firstname,
        members.idnumber
      FROM loans
      JOIN members ON loans.memberid = members.id
      WHERE loans.id = ${id};
    `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchFilteredLoans(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const loans = await sql<LoanForm[]>`
      SELECT
        loans.id,
        loans.memberid,
        loans.amount,
        loans.loanid,
        loans.interest,
        loans.term,
        loans.status,
        loans.date,
        loans.notes,
        loans.start_date,
        members.surname,
        members.firstName,
        groups.name      
      FROM loans
      JOIN members ON loans.memberid = members.id
      JOIN groups ON members.groupid = groups.id:: text
      WHERE
        loans.loanid ILIKE ${`%${query}%`} OR
        loans.amount::text ILIKE ${`%${query}%`} OR
        loans.interest::text ILIKE ${`%${query}%`} OR
        loans.term::text ILIKE ${`%${query}%`} OR
        loans.term::text ILIKE ${`%${query}%`} OR
        loans.status ILIKE ${`%${query}%`} OR
        groups.name ILIKE ${`%${query}%`} OR
        members.firstname ILIKE ${`%${query}%`} OR
        members.surname ILIKE ${`%${query}%`} OR
        groups.location ILIKE ${`%${query}%`} OR
        groups.date::text ILIKE ${`%${query}%`}
      ORDER BY loans.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return loans;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchLoansPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM loans
  `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchSelectLoans() {
  try {
    const loans = await sql<LoanForm[]>`
      SELECT
        loans.id,
        loans.memberid,
        loans.amount,
        loans.loanid,
        loans.interest,
        loans.term,
        loans.status,
        loans.date,
        members.surname,
        members.firstName,
        groups.name      
      FROM loans
      JOIN members ON loans.memberid = members.id
      JOIN groups ON members.groupid = groups.id:: text
   
      ORDER BY loans.date DESC
   
    `;

    return loans;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}
// Cards data

export async function fetchDashboardCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const groupCountPromise = sql`SELECT SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) FROM loans`;
    const membersCountPromise = sql`SELECT COUNT(*) FROM members`;
    const loanStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) AS "approved",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending",
         SUM(CASE WHEN status = 'inactive' THEN amount ELSE 0 END) AS "inactive"
         FROM loans`;
    const totalLoanPromise = sql`SELECT SUM((CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' THEN amount ELSE 0 END * (interest/4/100) + CASE WHEN status = 'approved' THEN 1 ELSE 0 END ) * term ) AS sum FROM loans`;
    const collectedLoanPromise = sql`SELECT SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS total FROM groupinvoice`;

    const data = await Promise.all([
      groupCountPromise,
      membersCountPromise,
      loanStatusPromise,
      totalLoanPromise,
      collectedLoanPromise,
    ]);

    const groupAmount = formatCurrencyToLocal(Number(data[0][0]?.sum || "0"));
    const numberOfMembers = Number(data[1][0]?.count ?? "0");

    const totalLoans = formatCurrencyToLocal(Number(data[3][0]?.sum ?? "0"));
    const totalCollectedLoans = formatCurrencyToLocal(
      Number(data[4][0]?.total ?? "0")
    );
    const pendingPayments = formatCurrencyToLocal(
      Number(data[0][0].sum ?? "0") - Number(data[4][0]?.total ?? "0")
    );
    const loanBalance = formatCurrencyToLocal(
      Number(data[3][0]?.sum || "0") - Number(data[4][0]?.total || "0")
    );
    return {
      groupAmount,
      numberOfMembers,
      totalLoans,
      totalCollectedLoans,
      pendingPayments,
      loanBalance,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchGroupInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM groupinvoice
    JOIN groups ON groupinvoice.group_id = groups.id
    WHERE
      groups.name ILIKE ${`%${query}%`} OR
      groupinvoice.amount::text ILIKE ${`%${query}%`} OR
      groupinvoice.date::text ILIKE ${`%${query}%`} OR
      groupinvoice.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredGroupInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        groupinvoice.id,
        groupinvoice.amount,
        groupinvoice.date,
        groupinvoice.status,
        groups.name
      
      FROM groupinvoice
      JOIN groups ON groupinvoice.group_id = groups.id
      WHERE
        groups.name ILIKE ${`%${query}%`} OR
        groupinvoice.amount::text ILIKE ${`%${query}%`} OR
        groupinvoice.date::text ILIKE ${`%${query}%`} OR
        groupinvoice.status ILIKE ${`%${query}%`}
      ORDER BY groupinvoice.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchGroupInvoiceById(id: string) {
  try {
    const data = await sql<InvoicesForm[]>`
      SELECT *
      FROM groupinvoice
      WHERE groupinvoice.id  = ${id};
    `;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fectchGroupCardData(id: string) {
  try {
    const data = await sql<MembersTable[]>`
      SELECT COUNT(*) 
      FROM members
      WHERE members.groupid = ${id}
    `;

    return Number(data[0] ?? "0");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchLatestGroupInvoices() {
  try {
    const data = await sql<LatestInvoice[]>`
      SELECT groupinvoice.amount, groups.name, groupinvoice.id, groupinvoice.date
      FROM groupinvoice
      JOIN groups ON groupinvoice.group_id = groups.id
      ORDER BY groupinvoice.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrencyToLocal(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchGroupCardData(id: string) {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const groupDisbursedPromise = sql`SELECT SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), SUM((CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' THEN amount ELSE 0 END * (interest/4/100) + CASE WHEN status = 'approved' THEN 1 ELSE 0 END ) * term ) AS payment FROM loans WHERE groupid = ${id} GROUP BY id`;
    const groupsCollectedPromise = sql`SELECT SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) FROM groupinvoice WHERE group_id = ${id}`;
    const groupsPendingPromise = sql`SELECT SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) FROM groupinvoice WHERE group_id = ${id}`;
    const totalMembersPromise = sql`SELECT COUNT(*) AS total FROM members WHERE groupid = ${id}`;

    const data = await Promise.all([
      groupDisbursedPromise,
      groupsCollectedPromise,
      groupsPendingPromise,
      totalMembersPromise,
    ]);

    const groupDisbusredAmount = formatCurrencyToLocal(
      Number(data[0][0]?.sum || "0")
    );
    const totalPayment = formatCurrencyToLocal(
      Number(data[0][0]?.payment ?? "0")
    );

    const groupCollectedAmount = formatCurrencyToLocal(
      Number(data[1][0]?.sum ?? "0")
    );

    const groupPendingPayments = formatCurrencyToLocal(
      Number(data[2][0]?.sum ?? "0")
    );
    const totalMembers = Number(data[3][0]?.total ?? "0");
    const balance = formatCurrencyToLocal(
      Number(data[0][0]?.payment ?? "0") - Number(data[1][0]?.sum ?? "0")
    );
    console.log(data);
    return {
      groupDisbusredAmount,
      totalPayment,
      groupCollectedAmount,
      groupPendingPayments,
      totalMembers,
      balance,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}
