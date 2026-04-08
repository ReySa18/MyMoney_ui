import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, setAccessToken, setRefreshToken, clearTokens } from '@/lib/api';
import type { LoginDto, RegisterDto, ChangePasswordDto } from '@/lib/api';

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      queryClient.clear(); // Clear all queries on login
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
