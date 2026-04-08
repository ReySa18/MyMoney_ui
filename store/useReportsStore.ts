import { create } from "zustand";
import { reportsApi, type YearlyReportResponse } from "@/lib/api";
import type { ReportData } from "@/types";

interface ReportsState {
  monthlyReports: ReportData[];
  yearlyReports: YearlyReportResponse[];
  loading: boolean;
  error: string | null;
  
  fetchMonthlyReports: (year?: number) => Promise<void>;
  fetchYearlyReports: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  monthlyReports: [],
  yearlyReports: [],
  loading: false,
  error: null,

  fetchMonthlyReports: async (year?: number) => {
    set({ loading: true, error: null });
    try {
      const monthlyReports = await reportsApi.getMonthly(year);
      set({ monthlyReports, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch monthly reports", loading: false });
    }
  },

  fetchYearlyReports: async () => {
    set({ loading: true, error: null });
    try {
      const yearlyReports = await reportsApi.getYearly();
      set({ yearlyReports, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch yearly reports", loading: false });
    }
  },
}));
