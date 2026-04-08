import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/lib/api';
import type { CreateAccountDto, UpdateAccountDto } from '@/lib/api';

// Query keys
export const accountKeys = {
  all: ['accounts'] as const,
  detail: (id: string) => ['accounts', id] as const,
};

// Queries
export const useAccounts = () => {
  return useQuery({
    queryKey: accountKeys.all,
    queryFn: accountsApi.getAll,
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountsApi.getById(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountDto) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
      accountsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
};
