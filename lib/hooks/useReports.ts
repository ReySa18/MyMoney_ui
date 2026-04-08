import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api';

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  monthly: (year?: number) => ['reports', 'monthly', year] as const,
  yearly: ['reports', 'yearly'] as const,
};

// Queries
export const useMonthlyReport = (year?: number) => {
  return useQuery({
    queryKey: reportKeys.monthly(year),
    queryFn: () => reportsApi.getMonthly(year),
  });
};

export const useYearlyReport = () => {
  return useQuery({
    queryKey: reportKeys.yearly,
    queryFn: reportsApi.getYearly,
  });
};
