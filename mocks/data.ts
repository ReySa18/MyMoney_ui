import type { Transaction, Account, Asset, Budget, CashFlowData, ExpenseCategory, ReportData, UserProfile } from "@/types";

export const mockUser: UserProfile = {
  id: "1",
  name: "Andi Pratama",
  email: "andi.pratama@email.com",
  avatar: "/avatar.jpg",
  phone: "+62 812 3456 7890",
  joinDate: "2024-01-15",
};

export const mockAccounts: Account[] = [
  { id: "1", name: "Bank BCA", type: "savings", icon: "landmark", balance: 62000000, color: "#3525cd" },
  { id: "2", name: "GoPay", type: "ewallet", icon: "wallet", balance: 4250000, color: "#006c49" },
  { id: "3", name: "Cash", type: "cash", icon: "banknote", balance: 1500000, color: "#960014" },
  { id: "4", name: "Bank Mandiri", type: "savings", icon: "landmark", balance: 15500000, color: "#4f46e5" },
  { id: "5", name: "OVO", type: "ewallet", icon: "wallet", balance: 1000000, color: "#6cf8bb" },
];

export const mockTransactions: Transaction[] = [
  { id: "1", description: "Gacoan Noodle", category: "Makanan & Minuman", categoryIcon: "utensils", amount: -45000, type: "expense", date: "2024-06-15", account: "GoPay" },
  { id: "2", description: "Shell Kebon Jeruk", category: "Transportasi", categoryIcon: "car", amount: -250000, type: "expense", date: "2024-06-14", account: "Bank BCA" },
  { id: "3", description: "Gaji Bulanan", category: "Pemasukan", categoryIcon: "banknote", amount: 12000000, type: "income", date: "2024-06-13", account: "Bank BCA" },
  { id: "4", description: "Uniqlo Indonesia", category: "Belanja", categoryIcon: "shopping-bag", amount: -599000, type: "expense", date: "2024-06-12", account: "Bank BCA" },
  { id: "5", description: "PLN Pasca Bayar", category: "Tagihan", categoryIcon: "home", amount: -450000, type: "expense", date: "2024-06-11", account: "Bank BCA" },
  { id: "6", description: "Freelance Project", category: "Pemasukan", categoryIcon: "banknote", amount: 5000000, type: "income", date: "2024-06-10", account: "Bank Mandiri" },
  { id: "7", description: "Netflix Subscription", category: "Hiburan", categoryIcon: "tv", amount: -186000, type: "expense", date: "2024-06-09", account: "GoPay" },
  { id: "8", description: "Grab Transport", category: "Transportasi", categoryIcon: "car", amount: -35000, type: "expense", date: "2024-06-08", account: "OVO" },
  { id: "9", description: "Starbucks", category: "Makanan & Minuman", categoryIcon: "coffee", amount: -78000, type: "expense", date: "2024-06-07", account: "GoPay" },
  { id: "10", description: "Tokopedia", category: "Belanja", categoryIcon: "shopping-bag", amount: -350000, type: "expense", date: "2024-06-06", account: "Bank BCA" },
  { id: "11", description: "Indihome", category: "Tagihan", categoryIcon: "wifi", amount: -399000, type: "expense", date: "2024-06-05", account: "Bank BCA" },
  { id: "12", description: "Dividen Saham", category: "Pemasukan", categoryIcon: "trending-up", amount: 750000, type: "income", date: "2024-06-04", account: "Bank Mandiri" },
];

export const mockAssets: Asset[] = [
  {
    id: "1", name: "Saham (IHSG)", type: "Saham", value: 45000000, allocation: 35,
    change: 5.2, icon: "trending-up", color: "#3525cd",
    history: [
      { date: "2024-01", value: 38000000 }, { date: "2024-02", value: 39500000 },
      { date: "2024-03", value: 41000000 }, { date: "2024-04", value: 42500000 },
      { date: "2024-05", value: 43800000 }, { date: "2024-06", value: 45000000 },
    ],
  },
  {
    id: "2", name: "Reksa Dana", type: "Reksa Dana", value: 25000000, allocation: 20,
    change: 3.8, icon: "pie-chart", color: "#006c49",
    history: [
      { date: "2024-01", value: 22000000 }, { date: "2024-02", value: 22800000 },
      { date: "2024-03", value: 23500000 }, { date: "2024-04", value: 24100000 },
      { date: "2024-05", value: 24600000 }, { date: "2024-06", value: 25000000 },
    ],
  },
  {
    id: "3", name: "Emas", type: "Emas", value: 30000000, allocation: 23,
    change: 8.1, icon: "gem", color: "#f59e0b",
    history: [
      { date: "2024-01", value: 25000000 }, { date: "2024-02", value: 26200000 },
      { date: "2024-03", value: 27500000 }, { date: "2024-04", value: 28400000 },
      { date: "2024-05", value: 29200000 }, { date: "2024-06", value: 30000000 },
    ],
  },
  {
    id: "4", name: "Deposito", type: "Deposito", value: 20000000, allocation: 15,
    change: 1.2, icon: "lock", color: "#4f46e5",
    history: [
      { date: "2024-01", value: 19000000 }, { date: "2024-02", value: 19200000 },
      { date: "2024-03", value: 19500000 }, { date: "2024-04", value: 19700000 },
      { date: "2024-05", value: 19900000 }, { date: "2024-06", value: 20000000 },
    ],
  },
  {
    id: "5", name: "Crypto", type: "Crypto", value: 8500000, allocation: 7,
    change: -2.4, icon: "bitcoin", color: "#960014",
    history: [
      { date: "2024-01", value: 10000000 }, { date: "2024-02", value: 9500000 },
      { date: "2024-03", value: 9200000 }, { date: "2024-04", value: 8800000 },
      { date: "2024-05", value: 8600000 }, { date: "2024-06", value: 8500000 },
    ],
  },
];

export const mockBudgets: Budget[] = [
  { id: "1", category: "Makanan & Minuman", icon: "utensils", limit: 3000000, spent: 2150000, color: "#3525cd" },
  { id: "2", category: "Transportasi", icon: "car", limit: 1500000, spent: 985000, color: "#006c49" },
  { id: "3", category: "Tagihan", icon: "home", limit: 2500000, spent: 2100000, color: "#4f46e5" },
  { id: "4", category: "Belanja", icon: "shopping-bag", limit: 2000000, spent: 1450000, color: "#f59e0b" },
  { id: "5", category: "Hiburan", icon: "tv", limit: 1000000, spent: 420000, color: "#960014" },
  { id: "6", category: "Kesehatan", icon: "heart", limit: 500000, spent: 150000, color: "#6cf8bb" },
];

export const mockCashFlow: CashFlowData[] = [
  { month: "JAN", income: 12000000, expense: 8500000 },
  { month: "FEB", income: 12500000, expense: 9200000 },
  { month: "MAR", income: 11800000, expense: 7800000 },
  { month: "APR", income: 13000000, expense: 9500000 },
  { month: "MEI", income: 12200000, expense: 8800000 },
  { month: "JUN", income: 12400000, expense: 8120000 },
];

export const mockExpenseCategories: ExpenseCategory[] = [
  { name: "Makanan", percentage: 45, amount: 3654000, color: "#3525cd" },
  { name: "Tagihan", percentage: 25, amount: 2030000, color: "#4f46e5" },
  { name: "Transportasi", percentage: 15, amount: 1218000, color: "#006c49" },
  { name: "Lainnya", percentage: 15, amount: 1218000, color: "#960014" },
];

export const mockReportData: ReportData[] = [
  { month: "Jan", income: 12000000, expense: 8500000 },
  { month: "Feb", income: 12500000, expense: 9200000 },
  { month: "Mar", income: 11800000, expense: 7800000 },
  { month: "Apr", income: 13000000, expense: 9500000 },
  { month: "Mei", income: 12200000, expense: 8800000 },
  { month: "Jun", income: 12400000, expense: 8120000 },
  { month: "Jul", income: 13100000, expense: 8900000 },
  { month: "Agu", income: 12800000, expense: 8600000 },
  { month: "Sep", income: 14000000, expense: 9100000 },
  { month: "Okt", income: 13500000, expense: 9400000 },
  { month: "Nov", income: 12900000, expense: 8700000 },
  { month: "Des", income: 15000000, expense: 11000000 },
];

export const totalBalance = 84250000;
export const monthlyIncome = 12400000;
export const monthlyExpense = 8120000;
export const balanceChange = 2.4;
