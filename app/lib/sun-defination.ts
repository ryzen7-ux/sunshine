export type LatestGroup = {
  id: string;
  reg: string;
  name: string;
  location: string;
  disbursed: string;
};

export type LatestInvoiceRaw = Omit<LatestGroup, "disbursed"> & {
  disbursed: number;
};

export type GroupsTable = {
  id: string;
  reg: string;
  name: string;
  location: string;
  members_count: string;
  disbursed: number;
};

export type GroupForm = {
  id: string;
  reg: string;
  name: string;
  location: string;
  members_count: string;
  disbursed: number;
};

export type MembersTable = {
  id: string;
  groupid: string;
  idnumber: number;
  surname: string;
  firstname: string;
  nature: string;
  phone: string;
  location: string;
  id_front: string;
  id_back: string;
  passport: string;
  doc: string;
};

export type MemberForm = {
  id: string;
  groupid: string;
  idnumber: number;
  surname: string;
  firstname: string;
  phone: string;
  nature: string;
  location: string;
  id_front: string;
  id_back: string;
  passport: string;
  doc: string;
  name: string;
};

export type LoanForm = {
  id: string;
  memberid: string;
  loanid: string;
  amount: number;
  interest: number;
  date: string;
  term: number;
  status: string;
  surname: string;
  firstname: string;
  phone: string;
  location: string;
  name: string;
  idnumber: string;
  start_date: string;
  notes: string;
  end_date: string;
  today: number;
  past_days: number;
};

export type InvoicesTable = {
  id: string;
  group_id: string;
  name: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type InvoicesForm = {
  id: string;
  group_id: string;
  name: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type LatestInvoice = {
  id: string;
  group_id: string;
  name: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type MpesaInvoice = {
  id: string;
  transid: string;
  transamount: number;
  transtime: string;
  refnumber: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
};
