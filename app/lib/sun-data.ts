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

// CLSOE DB COONECTIONS

const ITEMS_PER_PAGE = 6;
// USERS FETCH
export async function fetchUserByEmail(email: string) {
  try {
    const user = await sql<[]>`
    SELECT
      users.email,
      users.name,
      users.phone,
      users.role,
      users.status,
      users.password
    FROM users
    WHERE email = ${email}`;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserById(id: string) {
  try {
    const user = await sql<any[]>`
    SELECT
    users.id,
      users.email,
      users.name,
      users.phone,
      users.role,
      users.status,
      users.password
    FROM users
    WHERE users.id = ${id}`;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUsers() {
  try {
    const user = await sql<any[]>`
    SELECT
      users.id,
      users.email,
      users.name,
      users.phone,
      users.role,
      users.status
    FROM users
    ORDER BY users.id`;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// REGIONS FETCH
export async function fetchRegions() {
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
    ORDER BY regions.id`;

    return regions;
  } catch (error) {
    console.log(error);
  }
}
// INDIVIDUALS FETCH
export async function fetchIndividualsByIdNumber(idnumber: number) {
  try {
    const individuals = await sql<any[]>`
    SELECT
      individuals.id,
      individuals.name,
      individuals.region,
      individuals.phone,
      individuals.idnumber,
      individuals.business
    FROM individuals
    WHERE individuals.idnumber =${idnumber}`;

    return individuals;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchIndividuals() {
  try {
    const regions = await sql<any[]>`
    SELECT
      individuals.id,
      individuals.name,
      individuals.region,
      individuals.phone,
      individuals.idnumber,
      individuals.business
    FROM individuals
    ORDER BY name`;

    return regions;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchIndividualsById(id: string) {
  try {
    const individual = await sql<any[]>`
    SELECT
      individuals.id,
      individuals.name,
      individuals.region,
      individuals.phone,
      individuals.idnumber,
      individuals.business
    FROM individuals
    WHERE individuals.region::TEXT = ${id}
    ORDER BY individuals.name
 `;

    return individual;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchIndividualById(id: string) {
  try {
    const individual = await sql<any[]>`
    SELECT
      individuals.id,
      individuals.name,
      individuals.region,
      individuals.phone,
      individuals.idnumber,
      individuals.business
    FROM individuals
    WHERE individuals.id = ${id}
    ORDER BY individuals.name
 `;

    return individual;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchIndividualPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM individuals
  `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredIndividuals(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const groups = await sql<any[]>`
      SELECT
      individuals.id,
      individuals.name,
      individuals.region,
      individuals.phone,
      individuals.idnumber,
      individuals.business,
      regions.name as regionname
      FROM individuals
      JOIN regions ON regions.id = individuals.region
      WHERE
        individuals.name ILIKE ${`%${query}%`} OR
        individuals.phone ILIKE ${`%${query}%`} OR
        individuals.idnumber::TEXT ILIKE ${`%${query}%`} OR
        individuals.business ILIKE ${`%${query}%`} OR
        individuals.created::text ILIKE ${`%${query}%`}
      ORDER BY individuals.created DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return groups;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchFilteredIndividualLoans(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const individual_loans = await sql<any[]>`
      SELECT
      individuals_loans.id,
      individuals_loans.region,
      individuals_loans.loanee,
      individuals_loans.amount,
      individuals_loans.interest,
      individuals_loans.term,
      individuals_loans.status,
      individuals_loans.created,
      individuals.name,
      individuals.idnumber,
      regions.name as region,
      COALESCE(SUM(transamount), 0) as paid
            
      FROM individuals_loans
      INNER JOIN individuals ON individuals.id = individuals_loans.loanee
      iNNER JOIN regions ON regions.id = individuals.region
      LEFT JOIN mpesainvoice ON mpesainvoice.refnumber = individuals.idnumber::TEXT
      WHERE
        individuals_loans.amount::TEXT ILIKE ${`%${query}%`} OR
        individuals_loans.status ILIKE ${`%${query}%`} OR
        individuals_loans.created::TEXT ILIKE ${`%${query}%`} OR
        individuals.name ILIKE ${`%${query}%`} OR
        regions.name ILIKE ${`%${query}%`}
      GROUP BY individuals_loans.id, individuals.name, individuals.idnumber, regions.name, individuals.created 
      ORDER BY individuals.created DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const loan = individual_loans
      .map((item: any) => ({
        ...item,
        payment: computeTotalLoan(
          Math.trunc(item.amount),
          Math.trunc(item.interest),
          Math.trunc(item.term)
        ),
        interest: Math.trunc(item.interest),
        term: Math.trunc(item.term),
        created: formatDateToLocal(item.created),
        paid: formatCurrencyToLocal(Number(item.paid)),
      }))
      .sort((a: any, b: any) => b.created.localeCompare(a.created));

    console.log(loan);
    return loan;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function fetchIndividualsCardsData() {
  try {
    const individualsCollected =
      await sql`SELECT SUM(transamount) AS mpesa, individuals.idnumber::TEXT FROM mpesainvoice JOIN individuals ON individuals.idnumber::TEXT = mpesainvoice.refnumber WHERE mpesainvoice.refnumber ILIKE individuals.idnumber::TEXT GROUP BY individuals.idnumber`;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchIndividualLoansPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM individuals_loans
  `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

// GROUPS FETCH
export async function fetchFilteredGroups(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const groups = await sql<GroupsTable[]>`
    WITH summary1 AS (SELECT groupid, SUM(amount) as disbursed FROM loans GROUP BY groupid)
   
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
        groups.reg ILIKE ${`%${query}%`} OR
        groups.name ILIKE ${`%${query}%`} OR
        groups.location ILIKE ${`%${query}%`} OR
        groups.date::text ILIKE ${`%${query}%`}
      GROUP BY groups.id, s1.disbursed, regions.name
      ORDER BY groups.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return groups;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch groups.");
  }
}
// (SELECT COUNT(*) FROM members WHERE members.groupid = groups.id:: text ) as members_count,
// SUM(CASE WHEN loans.status = 'approved' THEN loans.amount ELSE 0 END)
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
        TO_CHAR(loans.date, 'YYYY-MM-DD HH24:MI:SS') AS date,
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
        TO_CHAR(loans.date, 'YYYY-MM-DD HH24:MI:SS') AS date,
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
        TO_CHAR(loans.date, 'YYYY-MM-DD HH24:MI:SS') AS date,
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
    const totalLoanPromise = sql`SELECT CEIL(SUM(CEIL(CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' 
    THEN amount ELSE 0 END * (interest/4/100)) * term )) AS sum FROM loans`;
    const collectedLoanPromise = sql`SELECT SUM(transamount) AS total FROM mpesainvoice`;

    // THIS MONTH
    const groupCountThisMonthPromise = sql`SELECT SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) 
    FROM loans WHERE date >= DATE_TRUNC('month', current_timestamp) AND date < DATE_TRUNC('month', current_timestamp) + INTERVAL '1 month'`;
    const totalLoanThisMonthPromise = sql`SELECT CEIL(SUM(CEIL(CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' 
    THEN amount ELSE 0 END * (interest/4/100)) * term )) AS sum FROM loans
     WHERE date >= DATE_TRUNC('month', current_timestamp) AND date < DATE_TRUNC('month', current_timestamp) + INTERVAL '1 month'`;
    const collectedThisMonthPromise = sql`SELECT SUM(transamount) AS total FROM mpesainvoice WHERE transtime >= DATE_TRUNC('month', current_timestamp)
     AND transtime < DATE_TRUNC('month', current_timestamp) + INTERVAL '1 month'`;
    const groupCountLastFourPromise = sql`WITH months AS (
    SELECT to_char(generate_series(date_trunc('year', CURRENT_DATE), date_trunc('year', CURRENT_DATE) + interval '1 year - 1 day', '1 month'), 'YYYY-MM') AS month
),
monthly_data AS (
    SELECT
        to_char(date, 'YYYY-MM') AS month,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) AS total
    FROM
        loans
    WHERE
        date >= date_trunc('year', CURRENT_DATE)
        AND date < date_trunc('year', CURRENT_DATE) + interval '1 year'
    GROUP BY
        1
)
SELECT
    m.month,
    COALESCE(md.total, 0) AS disbursed
FROM
    months m
LEFT JOIN
    monthly_data md ON m.month = md.month
ORDER BY
    m.month`;
    const individualCountLastFourPromise = sql`WITH months AS (
    SELECT to_char(generate_series(date_trunc('year', CURRENT_DATE), date_trunc('year', CURRENT_DATE) + interval '1 year - 1 day', '1 month'), 'YYYY-MM') AS month
),
monthly_data AS (
    SELECT
        to_char(created, 'YYYY-MM') AS month,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) AS total
    FROM
        individuals_loans
    WHERE
        created >= date_trunc('year', CURRENT_DATE)
        AND created < date_trunc('year', CURRENT_DATE) + interval '1 year'
    GROUP BY
        1
)
SELECT
    m.month,
    COALESCE(md.total, 0) AS disbursed
FROM
    months m
LEFT JOIN
    monthly_data md ON m.month = md.month
ORDER BY
    m.month`;

    const individualDisbursedPromsie = sql`SELECT SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) FROM individuals_loans`;
    const countIndividualsPromsie = sql`SELECT COUNT(*) from individuals`;
    const totalIndividualLoanPromise = sql`SELECT CEIL(SUM(CEIL(CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' 
    THEN amount ELSE 0 END * (interest/4/100)) * term )) AS sum FROM individuals_loans`;
    const individualLoanThisMonthPromise = sql`SELECT CEIL(SUM(CEIL(CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' 
    THEN amount ELSE 0 END * (interest/4/100)) * term )) AS sum FROM individuals_loans WHERE created >= DATE_TRUNC('month', current_timestamp) AND created < DATE_TRUNC('month', current_timestamp) + INTERVAL '1 month'`;
    const individualDisbursedThisMonthPromise = sql`SELECT CEIL(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) ) as disbursed
    FROM individuals_loans WHERE created >= DATE_TRUNC('month', current_timestamp) AND created < DATE_TRUNC('month', current_timestamp) + INTERVAL '1 month'`;

    const data = await Promise.all([
      groupCountPromise,
      membersCountPromise,
      loanStatusPromise,
      totalLoanPromise,
      collectedLoanPromise,
      groupCountThisMonthPromise,
      totalLoanThisMonthPromise,
      collectedThisMonthPromise,
      groupCountLastFourPromise,
      individualDisbursedPromsie,
      countIndividualsPromsie,
      totalIndividualLoanPromise,
      individualDisbursedThisMonthPromise,
      individualCountLastFourPromise,
      individualLoanThisMonthPromise,
    ]);

    const groupAmount = formatCurrencyToLocal(
      Number(data[0][0]?.sum || "0") + Number(data[9][0]?.sum ?? "0")
    );
    const numberOfMembers =
      Number(data[1][0]?.count ?? "0") + Number(data[10][0]?.count ?? "0");

    const totalLoans = formatCurrencyToLocal(
      Number(data[3][0]?.sum ?? "0") +
        Math.ceil(Number(data[11][0]?.sum) ?? "0")
    );
    const totalCollectedLoans = formatCurrencyToLocal(
      Number(data[4][0]?.total ?? "0")
    );
    const pendingPayments = formatCurrencyToLocal(
      Number(data[0][0].sum ?? "0") - Number(data[4][0]?.total ?? "0")
    );
    const loanBalance = formatCurrencyToLocal(
      Number(data[3][0]?.sum ?? "0") +
        Math.ceil(Number(data[11][0]?.sum) ?? "0") -
        Number(data[4][0]?.total || "0")
    );

    const monthlyDisbursement = formatCurrencyToLocal(
      Number(data[5][0]?.sum ?? "0") + Number(data[12][0].disbursed ?? "0")
    );

    const monthlyTotalLoan = formatCurrencyToLocal(
      Number(data[6][0]?.sum ?? "0") + Number(data[14][0].sum ?? "0")
    );

    const monthlyLoanBalance = formatCurrencyToLocal(
      Number(data[6][0]?.sum ?? "0") +
        Number(data[14][0].sum ?? "0") -
        Number(data[7][0]?.total ?? "0")
    );

    const monthlyCollected = formatCurrencyToLocal(
      Number(data[7][0]?.total ?? "0")
    );

    const disbursedSeries = data[8];
    const lastFourDisbursement = disbursedSeries.map(
      (item: any, index: any) => ({
        ...item,
        disbursed: Number(item.disbursed) + Number(data[13][index].disbursed),
      })
    );

    return {
      groupAmount,
      numberOfMembers,
      totalLoans,
      totalCollectedLoans,
      pendingPayments,
      loanBalance,
      monthlyDisbursement,
      monthlyTotalLoan,
      monthlyLoanBalance,
      monthlyCollected,
      lastFourDisbursement,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  } finally {
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
// MPESA FETCH LOGIC
export async function fetchMpesaInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM mpesainvoice
    WHERE
      mpesainvoice.transid ILIKE ${`%${query}%`} OR
      mpesainvoice.transtime::text ILIKE ${`%${query}%`} OR
      mpesainvoice.transamount::text ILIKE ${`%${query}%`} OR
      mpesainvoice.first_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.middle_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.last_name::text ILIKE ${`%${query}%`} OR
      mpesainvoice.phone_number::text ILIKE ${`%${query}%`} OR
      mpesainvoice.refnumber ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchFilteredMpesaInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<MpesaInvoice[]>`
      SELECT
        mpesainvoice.id,
        mpesainvoice.transid,
        mpesainvoice.first_name,
        mpesainvoice.middle_name,
        mpesainvoice.last_name,
        mpesainvoice.phone_number,
        mpesainvoice.transtime,
        mpesainvoice.transamount,
        mpesainvoice.refnumber
      FROM mpesainvoice
      WHERE
        mpesainvoice.transid ILIKE ${`%${query}%`} OR
        mpesainvoice.transtime::text ILIKE ${`%${query}%`} OR
        mpesainvoice.transamount::text ILIKE ${`%${query}%`} OR
        mpesainvoice.refnumber ILIKE ${`%${query}%`}
      ORDER BY mpesainvoice.transtime DESC
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

export async function fetchLatestMpesaInvoices() {
  try {
    const data = await sql<MpesaInvoice[]>`
      SELECT mpesainvoice.transamount, mpesainvoice.refnumber, mpesainvoice.transtime, mpesainvoice.transid, first_name, middle_name, last_name, phone_number
      FROM mpesainvoice
    
      ORDER BY mpesainvoice.transtime DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      transamount: formatCurrencyToLocal(invoice.transamount),
      transtime: formatDateToLocal(invoice.transtime),
    }));

    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchGroupCardData(id: string, name: string) {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const groupDisbursedPromise = sql`SELECT SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), SUM((CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' THEN amount ELSE 0 END * (interest/4/100) + CASE WHEN status = 'approved' THEN 1 ELSE 0 END ) * term ) AS payment FROM loans WHERE groupid = ${id} GROUP BY id`;

    const groupDisbursedPromise = sql`SELECT SUM(amount) FROM loans WHERE groupid=${id} and status = 'approved'`;
    const totalGroupLoan = sql`SELECT CEIL(SUM(CEIL(CASE WHEN status = 'approved' THEN amount ELSE 0 END/term + CASE WHEN status = 'approved' 
    THEN amount ELSE 0 END * (interest/4/100)) * term )) AS sum FROM loans WHERE groupid=${id}`;
    const groupsCollectedPromise = sql`SELECT SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) FROM groupinvoice WHERE group_id = ${id}`;
    const groupsPendingPromise = sql`SELECT SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) FROM groupinvoice WHERE group_id = ${id}`;
    const totalMembersPromise = sql`SELECT COUNT(*) AS total FROM members WHERE groupid = ${id}`;
    const collectedMpesaPromise = sql`SELECT SUM(transamount) AS mpesa FROM mpesainvoice WHERE mpesainvoice.refnumber ILIKE ${`%${name}%`} `;

    const data = await Promise.all([
      groupDisbursedPromise,
      groupsCollectedPromise,
      groupsPendingPromise,
      totalMembersPromise,
      collectedMpesaPromise,
      totalGroupLoan,
    ]);

    const groupDisbusredAmount = formatCurrencyToLocal(
      Number(data[0][0]?.sum || "0")
    );
    const totalPayment = formatCurrencyToLocal(Number(data[5][0]?.sum ?? "0"));

    const groupCollectedAmount = formatCurrencyToLocal(
      Number(data[1][0]?.sum ?? "0")
    );

    const groupPendingPayments = formatCurrencyToLocal(
      Number(data[2][0]?.sum ?? "0")
    );
    const totalMembers = Number(data[3][0]?.total ?? "0");
    const balance = formatCurrencyToLocal(
      Number(data[5][0]?.sum ?? "0") - Number(data[4][0]?.mpesa ?? "0")
    );
    const totalMpesa = formatCurrencyToLocal(Number(data[4][0]?.mpesa ?? "0"));

    return {
      groupDisbusredAmount,
      totalPayment,
      groupCollectedAmount,
      groupPendingPayments,
      totalMembers,
      balance,
      totalMpesa,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}
