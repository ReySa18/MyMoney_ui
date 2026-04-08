export interface Transaction {
  id: string;
  description: string;
  category: string;
  categoryIcon: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  account: string;
}

export interface Account {
  id: string;
  name: string;
  type: "savings" | "ewallet" | "cash" | "investment" | "credit";
  icon: string;
  balance: number;
  color: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  allocation: number;
  change: number;
  icon: string;
  color: string;
  history: { date: string; value: number }[];
}

export interface Budget {
  id: string;
  category: string;
  icon: string;
  limit: number;
  spent: number;
  color: string;
}

export interface ReportData {
  month: string;
  income: number;
  expense: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  joinDate: string;
}

export interface CashFlowData {
  month: string;
  income: number;
  expense: number;
}

export interface ExpenseCategory {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}
