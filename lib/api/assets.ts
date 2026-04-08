import apiClient from './client';
import type { Asset } from '@/types';

// API Response types (matching backend)
export interface AssetHistoryResponse {
  date: string;
  value: number;
}

export interface AssetResponse {
  id: string;
  name: string;
  type: string;
  value: number;
  allocation?: number;
  change?: number;
  icon: string | null;
  color: string | null;
  history?: AssetHistoryResponse[];
}

export interface AssetsListResponse {
  data: AssetResponse[];
  total_value: number;
}

export interface CreateAssetDto {
  name: string;
  type: string;
  value: number;
  icon?: string;
  color?: string;
}

export interface UpdateAssetDto {
  name?: string;
  type?: string;
  value?: number;
  icon?: string;
  color?: string;
  change?: number;
}

export interface CreateAssetHistoryDto {
  date: string;
  value: number;
}

// Transform backend response to frontend type
const transformAsset = (
  asset: AssetResponse,
  history: { date: string; value: number }[] = [],
): Asset => ({
  id: asset.id,
  name: asset.name,
  type: asset.type,
  value: asset.value,
  allocation: asset.allocation ?? 0,
  change: asset.change ?? 0,
  icon: asset.icon || '📊',
  color: asset.color || '#4f46e5',
  history: history,
});

// API functions
export const assetsApi = {
  getAll: async (): Promise<Asset[]> => {
    const response = await apiClient.get<AssetsListResponse>('/api/assets');
    return response.data.data.map((asset) => transformAsset(asset, []));
  },

  getAllWithAllocation: async (): Promise<Asset[]> => {
    return assetsApi.getAll();
  },

  getById: async (id: string): Promise<Asset> => {
    const response = await apiClient.get<AssetResponse>(`/api/assets/${id}`);
    return transformAsset(
      response.data,
      (response.data.history || []).map((h) => ({ date: h.date, value: h.value })),
    );
  },

  create: async (data: CreateAssetDto): Promise<Asset> => {
    const response = await apiClient.post<AssetResponse>('/api/assets', data);
    return transformAsset(response.data, []);
  },

  update: async (id: string, data: UpdateAssetDto): Promise<Asset> => {
    const response = await apiClient.patch<AssetResponse>(`/api/assets/${id}`, data);
    return transformAsset(response.data, []);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/assets/${id}`);
  },

  // Asset History
  getHistory: async (id: string): Promise<{ date: string; value: number }[]> => {
    const asset = await assetsApi.getById(id);
    return asset.history;
  },

  addHistory: async (id: string, data: CreateAssetHistoryDto): Promise<{ date: string; value: number }> => {
    const response = await apiClient.post<AssetHistoryResponse>(`/api/assets/${id}/history`, data);
    return { date: response.data.date, value: response.data.value };
  },
};

export default assetsApi;
