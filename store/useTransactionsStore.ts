import { create } from "zustand";
import { transactionsApi, type CreateTransactionDto, type UpdateTransactionDto, type QueryTransactionParams } from "@/lib/api";
import type { Transaction } from "@/types";

interface TransactionsState {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  
  fetchTransactions: (params?: QueryTransactionParams) => Promise<void>;
  createTransaction: (data: CreateTransactionDto) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransactionDto) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setPage: (page: number) => void;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  total: 0,
  page: 1,
  limit: 8,
  totalPages: 0,
  loading: false,
  error: null,

  fetchTransactions: async (params?: QueryTransactionParams) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionsApi.getAll({
        page: get().page,
        limit: get().limit,
        ...params,
      });
      set({ 
        transactions: response.data,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch transactions", loading: false });
    }
  },

  createTransaction: async (data: CreateTransactionDto) => {
    set({ loading: true, error: null });
    try {
      await transactionsApi.create(data);
      // Refresh transactions after creating
      await get().fetchTransactions();
    } catch (error: any) {
      set({ error: error.message || "Failed to create transaction", loading: false });
      throw error;
    }
  },

  updateTransaction: async (id: string, data: UpdateTransactionDto) => {
    set({ loading: true, error: null });
    try {
      await transactionsApi.update(id, data);
      // Refresh transactions after updating
      await get().fetchTransactions();
    } catch (error: any) {
      set({ error: error.message || "Failed to update transaction", loading: false });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await transactionsApi.delete(id);
      // Refresh transactions after deleting
      await get().fetchTransactions();
    } catch (error: any) {
      set({ error: error.message || "Failed to delete transaction", loading: false });
      throw error;
    }
  },

  setPage: (page: number) => {
    set({ page });
  },
}));
