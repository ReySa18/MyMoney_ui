import apiClient from './client';
import type { Transaction } from '@/types';

// API Response types (matching backend)
export interface TransactionResponse {
  id: string;
  description: string;
  category: string;
  category_icon: string | null;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  account_id?: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  account?: {
    id: string;
    name: string;
  };
}

interface TransactionListResponse {
  data: TransactionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTransactionDto {
  description: string;
  category: string;
  category_icon?: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  account_id: string;
  notes?: string;
}

export interface UpdateTransactionDto {
  description?: string;
  category?: string;
  category_icon?: string;
  amount?: number;
  type?: 'income' | 'expense';
  date?: string;
  account_id?: string;
  notes?: string;
}

export interface QueryTransactionParams {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense' | 'all';
  search?: string;
  start_date?: string;
  end_date?: string;
  account_id?: string;
  category?: string;
}

// Transform backend response to frontend type
const transformTransaction = (tx: TransactionResponse): Transaction => ({
  id: tx.id,
  description: tx.description,
  category: tx.category,
  categoryIcon: tx.category_icon || '📦',
  amount: tx.amount,
  type: tx.type,
  date: tx.date,
  accountId: tx.account_id || tx.account?.id || '',
  account: tx.account?.name || 'Unknown Account',
});

// API functions
export const transactionsApi = {
  getAll: async (params?: QueryTransactionParams): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<TransactionListResponse>('/api/transactions', {
      params,
    });
    return {
      data: response.data.data.map(transformTransaction),
      meta: {
        total: response.data.pagination.total,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.total_pages,
      },
    };
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<TransactionResponse>(`/api/transactions/${id}`);
    return transformTransaction(response.data);
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post<TransactionResponse>('/api/transactions', data);
    return transformTransaction(response.data);
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.patch<TransactionResponse>(`/api/transactions/${id}`, data);
    return transformTransaction(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/transactions/${id}`);
  },
};

export default transactionsApi;
