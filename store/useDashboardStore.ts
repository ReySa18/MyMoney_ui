import { create } from "zustand";
import { dashboardApi, type DashboardSummary } from "@/lib/api";
import type { CashFlowData, ExpenseCategory } from "@/types";

interface DashboardState {
  summary: DashboardSummary | null;
  cashflow: CashFlowData[];
  expenseCategories: ExpenseCategory[];
  loading: boolean;
  error: string | null;
  
  fetchSummary: () => Promise<void>;
  fetchCashflow: () => Promise<void>;
  fetchExpenseCategories: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  cashflow: [],
  expenseCategories: [],
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const summary = await dashboardApi.getSummary();
      set({ summary, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch summary", loading: false });
    }
  },

  fetchCashflow: async () => {
    set({ loading: true, error: null });
    try {
      const cashflow = await dashboardApi.getCashflow();
      set({ cashflow, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch cashflow", loading: false });
    }
  },

  fetchExpenseCategories: async () => {
    set({ loading: true, error: null });
    try {
      const expenseCategories = await dashboardApi.getExpenseCategories();
      set({ expenseCategories, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch expense categories", loading: false });
    }
  },

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [summary, cashflow, expenseCategories] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getCashflow(),
        dashboardApi.getExpenseCategories(),
      ]);
      set({ summary, cashflow, expenseCategories, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch dashboard data", loading: false });
    }
  },
}));
