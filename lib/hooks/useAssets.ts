import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api';
import type { CreateAssetDto, UpdateAssetDto, CreateAssetHistoryDto } from '@/lib/api';

// Query keys
export const assetKeys = {
  all: ['assets'] as const,
  allocation: ['assets', 'allocation'] as const,
  detail: (id: string) => ['assets', id] as const,
  history: (id: string) => ['assets', id, 'history'] as const,
};

// Queries
export const useAssets = () => {
  return useQuery({
    queryKey: assetKeys.all,
    queryFn: assetsApi.getAll,
  });
};

export const useAssetsWithAllocation = () => {
  return useQuery({
    queryKey: assetKeys.allocation,
    queryFn: assetsApi.getAllWithAllocation,
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: () => assetsApi.getById(id),
    enabled: !!id,
  });
};

export const useAssetHistory = (id: string) => {
  return useQuery({
    queryKey: assetKeys.history(id),
    queryFn: () => assetsApi.getHistory(id),
    enabled: !!id,
  });
};

// Mutations
export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetDto) => assetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
      queryClient.invalidateQueries({ queryKey: assetKeys.allocation });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssetDto }) =>
      assetsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
      queryClient.invalidateQueries({ queryKey: assetKeys.allocation });
      queryClient.invalidateQueries({ queryKey: assetKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.all });
      queryClient.invalidateQueries({ queryKey: assetKeys.allocation });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useAddAssetHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAssetHistoryDto }) =>
      assetsApi.addHistory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: assetKeys.history(variables.id) });
      queryClient.invalidateQueries({ queryKey: assetKeys.allocation });
    },
  });
};
