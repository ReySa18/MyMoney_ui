import apiClient from './client';
import type { CashFlowData, ExpenseCategory } from '@/types';

// API Response types (matching backend)
export interface DashboardSummaryResponse {
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
  balance_change_percentage: number;
  net_savings: number;
  month: string;
}

export interface CashflowResponse {
  month: string;
  income: number;
  expense: number;
}

export interface ExpenseCategoryResponse {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

interface DashboardCashflowApiResponse {
  data: CashflowResponse[];
}

interface DashboardExpenseCategoryApiResponse {
  data: ExpenseCategoryResponse[];
  period: string;
}

// Frontend types
export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalAssets: number;
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
  assetsChange: number;
}

// Transform backend response to frontend type
const transformSummary = (summary: DashboardSummaryResponse): DashboardSummary => ({
  totalBalance: summary.total_balance,
  totalIncome: summary.monthly_income,
  totalExpense: summary.monthly_expense,
  totalAssets: 0,
  balanceChange: summary.balance_change_percentage,
  incomeChange: 0,
  expenseChange: 0,
  assetsChange: 0,
});

const transformCashflow = (cashflow: CashflowResponse): CashFlowData => ({
  month: cashflow.month,
  income: cashflow.income,
  expense: cashflow.expense,
});

const transformExpenseCategory = (category: ExpenseCategoryResponse): ExpenseCategory => ({
  name: category.name,
  percentage: category.percentage,
  amount: category.amount,
  color: category.color,
});

// API functions
export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummaryResponse>('/api/dashboard/summary');
    return transformSummary(response.data);
  },

  getCashflow: async (): Promise<CashFlowData[]> => {
    const response = await apiClient.get<DashboardCashflowApiResponse>('/api/dashboard/cashflow');
    return response.data.data.map(transformCashflow);
  },

  getExpenseCategories: async (): Promise<ExpenseCategory[]> => {
    const response = await apiClient.get<DashboardExpenseCategoryApiResponse>('/api/dashboard/expense-categories');
    return response.data.data.map(transformExpenseCategory);
  },
};

export default dashboardApi;
