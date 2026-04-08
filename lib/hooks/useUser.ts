import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api';
import type { UpdateProfileDto, UpdatePreferencesDto } from '@/lib/api';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  profile: ['user', 'profile'] as const,
  preferences: ['user', 'preferences'] as const,
};

// Queries
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: userApi.getProfile,
  });
};

export const useUserPreferences = () => {
  return useQuery({
    queryKey: userKeys.preferences,
    queryFn: userApi.getPreferences,
  });
};

// Mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesDto) => userApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.preferences });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
  });
};
