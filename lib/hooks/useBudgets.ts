import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi } from '@/lib/api';
import type { CreateBudgetDto, UpdateBudgetDto, QueryBudgetParams } from '@/lib/api';

// Query keys
export const budgetKeys = {
  all: ['budgets'] as const,
  list: (params?: QueryBudgetParams) => ['budgets', 'list', params] as const,
  detail: (id: string) => ['budgets', id] as const,
};

// Queries
export const useBudgets = (params?: QueryBudgetParams) => {
  return useQuery({
    queryKey: budgetKeys.list(params),
    queryFn: () => budgetsApi.getAll(params),
  });
};

export const useBudget = (id: string) => {
  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: () => budgetsApi.getById(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetDto) => budgetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDto }) =>
      budgetsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
};
