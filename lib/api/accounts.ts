import apiClient from './client';
import type { Account } from '@/types';

// API Response types (matching backend)
export interface AccountResponse {
  id: string;
  name: string;
  type: 'savings' | 'ewallet' | 'cash' | 'investment' | 'credit';
  icon: string | null;
  balance: number;
  color: string | null;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

interface AccountsListResponse {
  data: AccountResponse[];
  total_balance: number;
}

export interface CreateAccountDto {
  name: string;
  type: 'savings' | 'ewallet' | 'cash' | 'investment' | 'credit';
  icon?: string;
  balance: number;
  color?: string;
}

export interface UpdateAccountDto {
  name?: string;
  type?: 'savings' | 'ewallet' | 'cash' | 'investment' | 'credit';
  icon?: string;
  balance?: number;
  color?: string;
}

// Transform backend response to frontend type
const transformAccount = (account: AccountResponse): Account => ({
  id: account.id,
  name: account.name,
  type: account.type,
  icon: account.icon || '💰',
  balance: account.balance,
  color: account.color || '#4f46e5',
});

// API functions
export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get<AccountsListResponse>('/api/accounts');
    return response.data.data.map(transformAccount);
  },

  getById: async (id: string): Promise<Account> => {
    const response = await apiClient.get<AccountResponse>(`/api/accounts/${id}`);
    return transformAccount(response.data);
  },

  create: async (data: CreateAccountDto): Promise<Account> => {
    const response = await apiClient.post<AccountResponse>('/api/accounts', data);
    return transformAccount(response.data);
  },

  update: async (id: string, data: UpdateAccountDto): Promise<Account> => {
    const response = await apiClient.patch<AccountResponse>(`/api/accounts/${id}`, data);
    return transformAccount(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/accounts/${id}`);
  },
};

export default accountsApi;
