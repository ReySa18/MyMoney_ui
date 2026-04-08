import { create } from "zustand";
import { budgetsApi, type CreateBudgetDto, type UpdateBudgetDto, type QueryBudgetParams } from "@/lib/api";
import type { Budget } from "@/types";

interface BudgetsState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  
  fetchBudgets: (params?: QueryBudgetParams) => Promise<void>;
  createBudget: (data: CreateBudgetDto) => Promise<void>;
  updateBudget: (id: string, data: UpdateBudgetDto) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export const useBudgetsStore = create<BudgetsState>((set, get) => ({
  budgets: [],
  loading: false,
  error: null,

  fetchBudgets: async (params?: QueryBudgetParams) => {
    set({ loading: true, error: null });
    try {
      const budgets = await budgetsApi.getAll(params);
      set({ budgets, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch budgets", loading: false });
    }
  },

  createBudget: async (data: CreateBudgetDto) => {
    set({ loading: true, error: null });
    try {
      const newBudget = await budgetsApi.create(data);
      set({ 
        budgets: [...get().budgets, newBudget], 
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to create budget", loading: false });
      throw error;
    }
  },

  updateBudget: async (id: string, data: UpdateBudgetDto) => {
    set({ loading: true, error: null });
    try {
      const updatedBudget = await budgetsApi.update(id, data);
      set({ 
        budgets: get().budgets.map(b => b.id === id ? updatedBudget : b),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to update budget", loading: false });
      throw error;
    }
  },

  deleteBudget: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await budgetsApi.delete(id);
      set({ 
        budgets: get().budgets.filter(b => b.id !== id),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete budget", loading: false });
      throw error;
    }
  },
}));
