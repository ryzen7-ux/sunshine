// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "sunshine@admin.com",
    password: "sunshine@2025",
  },
];

const customers = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
    image_url: "/customers/evil-rabbit.png",
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Delba de Oliveira",
    email: "delba@oliveira.com",
    image_url: "/customers/delba-de-oliveira.png",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Lee Robinson",
    email: "lee@robinson.com",
    image_url: "/customers/lee-robinson.png",
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Michael Novotny",
    email: "michael@novotny.com",
    image_url: "/customers/michael-novotny.png",
  },
  {
    id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    name: "Amy Burns",
    email: "amy@burns.com",
    image_url: "/customers/amy-burns.png",
  },
  {
    id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    name: "Balazs Orban",
    email: "balazs@orban.com",
    image_url: "/customers/balazs-orban.png",
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: "pending",
    date: "2022-12-06",
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: "pending",
    date: "2022-11-14",
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: "paid",
    date: "2022-10-29",
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: "paid",
    date: "2023-09-10",
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: "pending",
    date: "2023-08-05",
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: "pending",
    date: "2023-07-16",
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: "pending",
    date: "2023-06-27",
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: "paid",
    date: "2023-06-09",
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: "paid",
    date: "2023-06-17",
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: "paid",
    date: "2023-06-07",
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: "paid",
    date: "2023-08-19",
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: "paid",
    date: "2023-06-03",
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: "paid",
    date: "2022-06-05",
  },
];

const revenue = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3500 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 2500 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
];

const invoicees = [
  {
    name: "photocopy",
    invoiceNumber: "INV-2025-4-9-8559",
    date: "2025-05-09T10:31:47.714Z",
    quantity: 1,
    price: 50,
    tax: 0,
    payment: "cash",
  },
  {
    name: "printing",
    invoiceNumber: "INV-2025-4-9-8544",
    date: "2025-05-09T10:45:47.714Z",
    quantity: 1,
    price: 10,
    tax: 0,
    payment: "mpesa",
  },
];

const groups = [
  {
    id: "0f6da62a-19b8-4cde-9f43-188a607e7235",
    reg: "GRP0001",
    name: "GROUP A",
    location: "MAKUNGA",
    disbursed: "45000",
    date: "2025-05-09T10:31:47.714Z",
  },
  {
    id: "e49a8cfb-94be-4e16-87d7-c4a4f3cc6cd0",
    reg: "GRP0002",
    name: "GROUP B",
    location: "MATISI",
    disbursed: "45000",
    date: "2025-05-09T10:31:47.714Z",
  },
];

const members = [
  {
    groupId: "0f6da62a-19b8-4cde-9f43-188a607e7235",
    idNumber: 31986022,
    surname: "OMONID",
    firstName: "HENRY",
    phone: "0708663296",
    location: "MAKUNGA",
    date: "2025-05-09T10:31:47.714Z",
  },
  {
    groupId: "0f6da62a-19b8-4cde-9f43-188a607e7235",
    idNumber: 31986022,
    surname: "WAFULA",
    firstName: "MARTIN",
    phone: "0708663396",
    location: "KITALE",
    date: "2025-05-09T10:31:47.714Z",
  },
];

const loans = [
  {
    memberid: "2a3d2e00-98ae-4aaa-9e2c-73069ff564c9",
    amount: 50000,
    loanid: "LN001",
    interest: 5.1,
    term: 6,
    status: "pending",
    date: "2025-05-09T10:31:47.714Z",
  },
  {
    memberid: "918c565f-f87d-45a5-a1ea-8e7510109a89",
    amount: 70000,
    loanid: "LN002",
    interest: 5.1,
    term: 6,
    status: "approved",
    date: "2025-05-06T10:31:47.714Z",
  },
];

const ginvoices = [
  {
    group_id: groups[0].id,
    amount: 15795,
    status: "paid",
    date: "2022-12-06",
  },
  {
    group_id: groups[1].id,
    amount: 20348,
    status: "pending",
    date: "2022-11-14",
  },
];

export {
  users,
  customers,
  invoices,
  revenue,
  invoicees,
  groups,
  members,
  loans,
  ginvoices,
};
