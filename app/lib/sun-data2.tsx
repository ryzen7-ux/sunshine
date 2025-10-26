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
  MpesaInvoice,
} from "./sun-defination";
import {
  formatCurrencyToLocal,
  formatDateToLocal,
  computeTotalLoan,
} from "@/app/lib/utils";
import { getSession } from "@/app/lib/session";

// CLSOE DB COONECTIONS

const ITEMS_PER_PAGE = 6;

export async function fetchMpesaInvoicesPages2(query: string, userId: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM mpesainvoice
    JOIN individuals ON LOWER(individuals.idnumber::TEXT) = LOWER(mpesaInvoice.refnumber) 
    JOIN regions ON 
    regions.id = individuals.region 
    WHERE
    regions.manager = ${userId} AND
    mpesainvoice.cycle::TEXT ILIKE ${`%${query}%`} OR
    ( mpesainvoice.transid ILIKE ${`%${query}%`} OR
      mpesainvoice.transtime::text ILIKE ${`%${query}%`} OR
      mpesainvoice.transamount::text ILIKE ${`%${query}%`} OR
      mpesainvoice.first_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.middle_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.last_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.phone_number::text ILIKE ${`%${query}%`} OR
      mpesainvoice.refnumber ILIKE ${`%${query}%`})
  `;
    const data2 = await sql`SELECT COUNT(*)
    FROM mpesainvoice
    JOIN groups ON LOWER(groups.name) = LOWER(mpesaInvoice.refnumber) JOIN regions ON 
    regions.id = groups.region 
    WHERE
    regions.manager = ${userId} AND
    (
      mpesainvoice.transid ILIKE ${`%${query}%`} OR
      mpesainvoice.cycle::TEXT ILIKE ${`%${query}%`} OR
      mpesainvoice.transtime::text ILIKE ${`%${query}%`} OR
      mpesainvoice.transamount::text ILIKE ${`%${query}%`} OR
      mpesainvoice.first_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.middle_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.last_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.phone_number::text ILIKE ${`%${query}%`} OR
      mpesainvoice.refnumber ILIKE ${`%${query}%`})
  `;
    const combinedArr = Number(data[0].count) + Number(data2[0].count);
    const totalPages = Math.ceil(combinedArr / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredMpesaInvoices2(
  query: string,
  currentPage: number,
  userId: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const startIndex = currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
  const endIndex = currentPage * ITEMS_PER_PAGE;
  try {
    const invoices = await sql<MpesaInvoice[]>`
      SELECT
        mpesainvoice.id,
        mpesainvoice.transid,
        mpesainvoice.cycle,
        mpesainvoice.first_name,
        mpesainvoice.middle_name,
        mpesainvoice.last_name,
        mpesainvoice.phone_number,
        mpesainvoice.transtime,
        mpesainvoice.transamount,
        mpesainvoice.refnumber
      FROM mpesainvoice  
        JOIN groups ON LOWER(groups.name) = LOWER(mpesaInvoice.refnumber) 
        JOIN regions ON regions.id = groups.region 
      WHERE
      regions.manager = ${userId} AND
      ( mpesainvoice.transid ILIKE ${`%${query}%`} OR
        mpesainvoice.cycle::TEXT ILIKE ${`%${query}%`} OR
        mpesainvoice.transtime::text ILIKE ${`%${query}%`} OR
        mpesainvoice.transamount::text ILIKE ${`%${query}%`} OR
        mpesainvoice.refnumber ILIKE ${`%${query}%`})
      ORDER BY mpesainvoice.transtime DESC
     
    `;
    const invoices2 = await sql<MpesaInvoice[]>`
      SELECT
        mpesainvoice.id,
        mpesainvoice.transid,
        mpesainvoice.first_name,
         mpesainvoice.cycle,
        mpesainvoice.middle_name,
        mpesainvoice.last_name,
        mpesainvoice.phone_number,
        mpesainvoice.transtime,
        mpesainvoice.transamount,
        mpesainvoice.refnumber
      FROM mpesainvoice  
        JOIN individuals ON individuals.idnumber::TEXT = LOWER(mpesaInvoice.refnumber) 
        JOIN regions ON regions.id = individuals.region 
      WHERE
      regions.manager = ${userId} AND
      ( mpesainvoice.transid ILIKE ${`%${query}%`} OR
        mpesainvoice.cycle::TEXT ILIKE ${`%${query}%`} OR
        mpesainvoice.transtime::text ILIKE ${`%${query}%`} OR
        mpesainvoice.transamount::text ILIKE ${`%${query}%`} OR
        mpesainvoice.refnumber ILIKE ${`%${query}%`})
      ORDER BY mpesainvoice.transtime DESC
    `;
    const combinedInvoices = invoices?.concat(invoices2);

    const newInvoices = combinedInvoices
      ?.sort(
        (a: any, b: any) => b.transtime?.getTime() - a.transtime?.getTime()
      )
      .slice(startIndex, endIndex);

    return newInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchFilteredGroups2(
  query: string,
  currentPage: number,
  userId: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const groups = await sql<GroupsTable[]>`
    WITH summary1 AS (SELECT groupid, SUM(amount) as disbursed FROM loans WHERE status='approved' GROUP BY groupid)
   
      SELECT
        groups.id,
        groups.reg,
        groups.name,
        groups.location,
        groups.region,
        groups.date, 
        regions.name as region_name,
        (SELECT COUNT(*) FROM members WHERE members.groupid = groups.id:: text ) as members_count,
        s1.disbursed 
      FROM groups
      LEFT JOIN summary1 s1 ON groups.id = s1.groupid
    JOIN regions ON regions.id = groups.region
      WHERE
    regions.manager = ${userId} AND 
       ( groups.reg ILIKE ${`%${query}%`} OR
        groups.name ILIKE ${`%${query}%`} OR
        groups.location ILIKE ${`%${query}%`} OR
        groups.date::text ILIKE ${`%${query}%`})
      GROUP BY groups.id, s1.disbursed, regions.name
      ORDER BY groups.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    console.log(groups);
    return groups;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchGroupPages2(query: string, userId: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM groups JOIN regions ON regions.id = groups.region WHERE regions.manager = ${userId}
  `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchRegion2(userId: any) {
  try {
    const regions = await sql<any[]>`
    SELECT
      regions.id,
      regions.name,
      regions.county,
      regions.manager,
      users.name as custodian
    FROM regions
    JOIN users on regions.manager = users.id
    WHERE regions.manager = ${userId}
    ORDER BY regions.id`;

    return regions;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchLoansPages2(query: string, userId: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM loans JOIN groups ON groups.id = loans.groupid JOIN regions ON
    regions.id = groups.region WHERE regions.manager = ${userId}
  `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredLoans2(
  query: string,
  currentPage: number,
  userId: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const loans = await sql<LoanForm[]>`
      SELECT
        loans.id,
        loans.memberid,
        loans.amount,
        loans.loanid,
        loans.interest,
        loans.fee,
        loans.term,
        loans.status,
        loans.date,
        loans.notes,
        loans.cycle,
        loans.start_date,
                CEIL(CEIL(loans.amount / term + amount * (interest/4/100)) * term) as total,
        loans.start_date,
        loans.start_date + (COALESCE(loans.term, 0) * INTERVAL '1 week') AS end_date,
        members.surname,
        members.firstName,
        groups.name      
      FROM loans
      JOIN members ON loans.memberid = members.id
      JOIN groups ON members.groupid = groups.id:: text
      JOIN regions ON regions.id = groups.region
      WHERE
      regions.manager = ${userId} AND 
       (loans.loanid ILIKE ${`%${query}%`} OR
        loans.cycle::TEXT ILIKE ${`%${query}%`} OR
        loans.fee::TEXT ILIKE ${`%${query}%`} OR
        loans.amount::text ILIKE ${`%${query}%`} OR
        loans.interest::text ILIKE ${`%${query}%`} OR
        loans.term::text ILIKE ${`%${query}%`} OR
        loans.term::text ILIKE ${`%${query}%`} OR
        loans.status ILIKE ${`%${query}%`} OR
        groups.name ILIKE ${`%${query}%`} OR
        members.firstname ILIKE ${`%${query}%`} OR
        members.surname ILIKE ${`%${query}%`} OR
        groups.location ILIKE ${`%${query}%`} OR
        groups.date::text ILIKE ${`%${query}%`})
      ORDER BY loans.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return loans;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchGroups2(userId: string) {
  try {
    const groups = await sql<GroupForm[]>`
      SELECT *
      FROM regions JOIN groups ON  groups.region = regions.id 
      WHERE regions.manager = ${userId}
      ORDER BY groups.name ASC
    `;
    return groups;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}
