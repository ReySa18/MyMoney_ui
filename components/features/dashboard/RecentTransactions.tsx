"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import { formatCurrency } from "@/lib/currency";
import {
  Utensils, Car, Banknote, ShoppingBag, Home, Tv, Coffee, Wifi, TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Transaction } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  utensils: Utensils,
  car: Car,
  banknote: Banknote,
  "shopping-bag": ShoppingBag,
  home: Home,
  tv: Tv,
  coffee: Coffee,
  wifi: Wifi,
  "trending-up": TrendingUp,
};

export function RecentTransactions({ transactions: propTransactions }: { transactions?: Transaction[] }) {
  const { t } = useTranslation();
  const currency = usePreferencesStore((s) => s.currency);
  const { transactions: storeTransactions, fetchTransactions, loading } = useTransactionsStore();

  useEffect(() => {
    if (!propTransactions) {
      fetchTransactions({ limit: 5 });
    }
  }, [propTransactions, fetchTransactions]);

  const displayTransactions = (propTransactions || storeTransactions).slice(0, 5);

  const getRelativeDate = (dateStr: string) => {
    const now = new Date("2024-06-15");
    const date = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("common.today");
    if (diffDays === 1) return t("common.yesterday");
    return t("common.daysAgo", { count: diffDays });
  };

  return (
    <div className="card-tonal">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-on-surface">
          {t("dashboard.recentTransactions")}
        </h3>
        <Link
          href="/transactions"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.viewAll")}
        </Link>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-on-surface-variant">
            Loading...
          </div>
        ) : displayTransactions.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-on-surface-variant">
            {t("dashboard.noTransactions")}
          </div>
        ) : (
          displayTransactions.map((tx, i) => {
            const Icon = iconMap[tx.categoryIcon] || Banknote;
            const isIncome = tx.type === "income";

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isIncome ? "bg-secondary/10" : "bg-surface-container-high"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isIncome ? "text-secondary" : "text-on-surface-variant"
                    }`}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {tx.category} • {getRelativeDate(tx.date)}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold whitespace-nowrap ${
                    isIncome ? "text-secondary" : "text-on-surface"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(Math.abs(tx.amount), currency)}
                </p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
