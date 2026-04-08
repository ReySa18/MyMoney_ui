import { create } from "zustand";
import { assetsApi, type CreateAssetDto, type UpdateAssetDto, type CreateAssetHistoryDto } from "@/lib/api";
import type { Asset } from "@/types";

interface AssetsState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  
  fetchAssets: () => Promise<void>;
  createAsset: (data: CreateAssetDto) => Promise<void>;
  updateAsset: (id: string, data: UpdateAssetDto) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  addAssetHistory: (id: string, data: CreateAssetHistoryDto) => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
  assets: [],
  loading: false,
  error: null,

  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const assets = await assetsApi.getAll();
      set({ assets, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch assets", loading: false });
    }
  },

  createAsset: async (data: CreateAssetDto) => {
    set({ loading: true, error: null });
    try {
      const newAsset = await assetsApi.create(data);
      set({ 
        assets: [...get().assets, newAsset], 
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to create asset", loading: false });
      throw error;
    }
  },

  updateAsset: async (id: string, data: UpdateAssetDto) => {
    set({ loading: true, error: null });
    try {
      const updatedAsset = await assetsApi.update(id, data);
      set({ 
        assets: get().assets.map(a => a.id === id ? updatedAsset : a),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to update asset", loading: false });
      throw error;
    }
  },

  deleteAsset: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await assetsApi.delete(id);
      set({ 
        assets: get().assets.filter(a => a.id !== id),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to delete asset", loading: false });
      throw error;
    }
  },

  addAssetHistory: async (id: string, data: CreateAssetHistoryDto) => {
    set({ loading: true, error: null });
    try {
      await assetsApi.addHistory(id, data);
      // Refresh assets after adding history
      await get().fetchAssets();
    } catch (error: any) {
      set({ error: error.message || "Failed to add asset history", loading: false });
      throw error;
    }
  },
}));
