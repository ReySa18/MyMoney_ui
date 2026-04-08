"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion } from "framer-motion";

export function ExpenseAllocation() {
  const { t } = useTranslation();
  const { expenseCategories, fetchExpenseCategories, loading } = useDashboardStore();

  useEffect(() => {
    fetchExpenseCategories();
  }, [fetchExpenseCategories]);

  const totalUsed = expenseCategories.reduce((sum, cat) => sum + cat.percentage, 0);

  return (
    <div className="card-tonal h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-on-surface">
          {t("dashboard.costAllocation")}
        </h3>
        <span className="text-xs text-on-surface-variant font-medium">
          {t("dashboard.thisMonth")}
        </span>
      </div>

      {/* Circular-like progress indicator */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-surface-container">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="hsl(var(--surface-container-highest))"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 176" }}
              animate={{
                strokeDasharray: `${(totalUsed / 100) * 176} 176`,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-on-surface">
            {totalUsed}%
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface">
            {totalUsed}% {t("dashboard.budgetUsed")}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-on-surface-variant">
            Loading...
          </div>
        ) : expenseCategories.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-on-surface-variant">
            {t("dashboard.noExpenses")}
          </div>
        ) : (
          expenseCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-on-surface">{cat.name}</span>
                <span className="text-sm font-semibold text-on-surface">
                  {cat.percentage}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
