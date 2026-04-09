import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, setAccessToken, setRefreshToken, clearTokens, userApi, dashboardApi, accountsApi, transactionsApi } from '@/lib/api';
import type { LoginDto, RegisterDto, ChangePasswordDto } from '@/lib/api';
import { userKeys } from './useUser';
import { dashboardKeys } from './useDashboard';
import { accountKeys } from './useAccounts';
import { transactionKeys } from './useTransactions';

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: async (response) => {
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      queryClient.clear(); // Clear semua query lama sebelum prefetch data user baru

      // Prefetch paralel semua data inti — non-blocking via allSettled
      // Data sudah di cache saat dashboard di-render → minim spinner
      await Promise.allSettled([
        queryClient.prefetchQuery({ queryKey: userKeys.profile, queryFn: userApi.getProfile }),
        queryClient.prefetchQuery({ queryKey: userKeys.preferences, queryFn: userApi.getPreferences }),
        queryClient.prefetchQuery({ queryKey: dashboardKeys.summary, queryFn: dashboardApi.getSummary }),
        queryClient.prefetchQuery({ queryKey: dashboardKeys.cashflow, queryFn: dashboardApi.getCashflow }),
        queryClient.prefetchQuery({ queryKey: dashboardKeys.expenseCategories, queryFn: dashboardApi.getExpenseCategories }),
        queryClient.prefetchQuery({ queryKey: accountKeys.all, queryFn: accountsApi.getAll }),
        queryClient.prefetchQuery({
          queryKey: transactionKeys.list({ limit: 5 }),
          queryFn: () => transactionsApi.getAll({ limit: 5 }),
        }),
      ]);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      queryClient.clear(); // Clear all queries on register
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      queryClient.clear(); // Clear all queries on logout
    },
    onError: () => {
      // Even if logout fails, clear tokens locally
      clearTokens();
      queryClient.clear();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => authApi.changePassword(data),
  });
};
