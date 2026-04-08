import apiClient from './client';
import type { Budget } from '@/types';

// API Response types (matching backend)
export interface BudgetResponse {
  id: string;
  category: string;
  icon: string | null;
  limit: number;
  spent: number;
  color: string | null;
  period: string;
  remaining?: number;
  percentage?: number;
  is_active?: boolean;
}

interface BudgetsListResponse {
  data: BudgetResponse[];
  summary: {
    total_budget: number;
    total_spent: number;
    total_remaining: number;
  };
}

export interface CreateBudgetDto {
  category: string;
  icon?: string;
  limit: number;
  color?: string;
  period: string; // format: YYYY-MM
}

export interface UpdateBudgetDto {
  category?: string;
  icon?: string;
  limit?: number;
  color?: string;
  period?: string;
}

export interface QueryBudgetParams {
  period?: string; // format: YYYY-MM
}

// Transform backend response to frontend type
const transformBudget = (budget: BudgetResponse): Budget => ({
  id: budget.id,
  category: budget.category,
  icon: budget.icon || '📦',
  limit: budget.limit,
  spent: budget.spent,
  color: budget.color || '#4f46e5',
});

// API functions
export const budgetsApi = {
  getAll: async (params?: QueryBudgetParams): Promise<Budget[]> => {
    const response = await apiClient.get<BudgetsListResponse>('/api/budgets', { params });
    return response.data.data.map(transformBudget);
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await apiClient.get<BudgetResponse>(`/api/budgets/${id}`);
    return transformBudget(response.data);
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await apiClient.post<BudgetResponse>('/api/budgets', data);
    return transformBudget(response.data);
  },

  update: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    const response = await apiClient.patch<BudgetResponse>(`/api/budgets/${id}`, data);
    return transformBudget(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/budgets/${id}`);
  },
};

export default budgetsApi;
