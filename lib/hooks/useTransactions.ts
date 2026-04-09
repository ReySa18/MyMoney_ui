import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api';
import type { CreateTransactionDto, UpdateTransactionDto, QueryTransactionParams } from '@/lib/api';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  list: (params?: QueryTransactionParams) => ['transactions', 'list', params] as const,
  detail: (id: string) => ['transactions', id] as const,
};

// Queries
export const useTransactions = (
  params?: QueryTransactionParams,
  options?: { placeholderData?: typeof keepPreviousData; enabled?: boolean }
) => {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => transactionsApi.getAll(params),
    ...options,
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Also invalidate dashboard and reports since transactions affect them
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      transactionsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};
