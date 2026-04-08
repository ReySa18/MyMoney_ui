import { create } from "zustand";
import { accountsApi, type CreateAccountDto, type UpdateAccountDto } from "@/lib/api";
import type { Account } from "@/types";

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  
  fetchAccounts: () => Promise<void>;
  createAccount: (data: CreateAccountDto) => Promise<void>;
  updateAccount: (id: string, data: UpdateAccountDto) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
  accounts: [],
  loading: false,
  error: null,

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const accounts = await accountsApi.getAll();
      set({ accounts, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch accounts", loading: false });
    }
  },

  createAccount: async (data: CreateAccountDto) => {
    set({ loading: true, error: null });
    try {
      const newAccount = await accountsApi.create(data);
      set({ 
        accounts: [...get().accounts, newAccount], 
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to create account", loading: false });
      throw error;
    }
  },

  updateAccount: async (id: string, data: UpdateAccountDto) => {
    set({ loading: true, error: null });
    try {
      const updatedAccount = await accountsApi.update(id, data);
      set({ 
        accounts: get().accounts.map(acc => acc.id === id ? updatedAccount : acc),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to update account", loading: false });
      throw error;
    }
  },

  deleteAccount: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await accountsApi.delete(id);
      set({ 
        accounts: get().accounts.filter(acc => acc.id !== id),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete account", loading: false });
      throw error;
    }
  },
}));
