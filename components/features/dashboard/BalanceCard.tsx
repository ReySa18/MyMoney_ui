"use client";

import { useEffect } from "react";
import { TrendingUp, ArrowDown, ArrowUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency, formatPercentage } from "@/lib/currency";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion } from "framer-motion";

export function BalanceCard() {
  const { t } = useTranslation();
  const currency = usePreferencesStore((s) => s.currency);
  const { summary, fetchSummary, loading } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance — Hero card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="card-elevated md:col-span-1 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[4rem]" />
        <div className="relative">
          <p className="text-label-sm text-on-surface-variant mb-1">
            {t("dashboard.totalBalance")}
          </p>
          <h2 className="font-heading text-[2rem] font-bold text-on-surface leading-tight">
            {loading ? "..." : formatCurrency(summary?.totalBalance || 0, currency)}
          </h2>
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              {loading ? "..." : formatPercentage(summary?.balanceChange || 0)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Income */}
      <motion.div whileHover={{ y: -2 }} className="card-tonal">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-label-sm text-on-surface-variant mb-1">
              {t("dashboard.monthlyIncome")}
            </p>
            <h3 className="font-heading text-xl font-bold text-on-surface">
              {loading ? "..." : formatCurrency(summary?.totalIncome || 0, currency)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-secondary" />
          </div>
        </div>
      </motion.div>

      {/* Expense */}
      <motion.div whileHover={{ y: -2 }} className="card-tonal">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-label-sm text-on-surface-variant mb-1">
              {t("dashboard.monthlyExpense")}
            </p>
            <h3 className="font-heading text-xl font-bold text-on-surface">
              {loading ? "..." : formatCurrency(summary?.totalExpense || 0, currency)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
            <ArrowUp className="w-5 h-5 text-tertiary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
