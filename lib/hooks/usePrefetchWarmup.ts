'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { transactionsApi, budgetsApi, assetsApi, reportsApi } from '@/lib/api';
import { transactionKeys } from './useTransactions';
import { budgetKeys } from './useBudgets';
import { assetKeys } from './useAssets';
import { reportKeys } from './useReports';

/**
 * Background warm-up hook — dipanggil sekali saat dashboard pertama kali mount.
 * Menggunakan requestIdleCallback (atau setTimeout fallback) agar tidak mengganggu
 * rendering awal dashboard. Prefetch halaman-halaman yang sering dikunjungi
 * sehingga navigasi berikutnya terasa instan.
 */
export function usePrefetchWarmup() {
  const queryClient = useQueryClient();
  const hasWarmedUp = useRef(false);

  useEffect(() => {
    // Hanya jalankan sekali
    if (hasWarmedUp.current) return;
    hasWarmedUp.current = true;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const warmup = () => {
      // Prefetch halaman transaksi page 1
      queryClient.prefetchQuery({
        queryKey: transactionKeys.list({ page: 1, limit: 8 }),
        queryFn: () => transactionsApi.getAll({ page: 1, limit: 8 }),
      });

      // Prefetch budgets bulan berjalan
      queryClient.prefetchQuery({
        queryKey: budgetKeys.list({ period: currentMonth }),
        queryFn: () => budgetsApi.getAll({ period: currentMonth }),
      });

      // Prefetch assets list
      queryClient.prefetchQuery({
        queryKey: assetKeys.all,
        queryFn: assetsApi.getAll,
      });

      // Prefetch monthly report tahun berjalan
      queryClient.prefetchQuery({
        queryKey: reportKeys.monthly(currentYear),
        queryFn: () => reportsApi.getMonthly(currentYear),
      });
    };

    // Jalankan saat browser idle — fallback ke setTimeout 300ms
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(warmup, { timeout: 2000 });
    } else {
      setTimeout(warmup, 300);
    }
  }, [queryClient]);
}
