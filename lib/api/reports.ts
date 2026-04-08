import apiClient from './client';
import type { ReportData } from '@/types';

// API Response types (matching backend)
export interface MonthlyReportResponse {
  month: string;
  income: number;
  expense: number;
}

export interface YearlyReportResponse {
  year: number;
  income: number;
  expense: number;
  net_income: number;
}

interface MonthlyReportApiResponse {
  year: number;
  data: MonthlyReportResponse[];
  summary: {
    total_income: number;
    total_expense: number;
    net_income: number;
  };
}

interface YearlyReportApiResponse {
  data: YearlyReportResponse[];
  summary: {
    total_income: number;
    total_expense: number;
    net_income: number;
    average_monthly_income: number;
    average_monthly_expense: number;
  };
}

// Transform backend response to frontend type
const transformMonthlyReport = (report: MonthlyReportResponse): ReportData => ({
  month: report.month,
  income: report.income,
  expense: report.expense,
});

// API functions
export const reportsApi = {
  getMonthly: async (year?: number): Promise<ReportData[]> => {
    const response = await apiClient.get<MonthlyReportApiResponse>('/api/reports/monthly', {
      params: year ? { year } : undefined,
    });
    return response.data.data.map(transformMonthlyReport);
  },

  getYearly: async (): Promise<YearlyReportResponse[]> => {
    const response = await apiClient.get<YearlyReportApiResponse>('/api/reports/yearly');
    return response.data.data;
  },
};

export default reportsApi;
