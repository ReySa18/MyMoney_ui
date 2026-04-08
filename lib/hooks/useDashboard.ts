import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: ['dashboard', 'summary'] as const,
  cashflow: ['dashboard', 'cashflow'] as const,
  expenseCategories: ['dashboard', 'expense-categories'] as const,
};

// Queries
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: dashboardApi.getSummary,
  });
};

export const useCashflow = () => {
  return useQuery({
    queryKey: dashboardKeys.cashflow,
    queryFn: dashboardApi.getCashflow,
  });
};

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: dashboardKeys.expenseCategories,
    queryFn: dashboardApi.getExpenseCategories,
  });
};
