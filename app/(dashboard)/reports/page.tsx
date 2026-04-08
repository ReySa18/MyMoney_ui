"use client";

import { useEffect } from "react";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useReportsStore } from "@/store/useReportsStore";
import { formatCurrency } from "@/lib/currency";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const { t } = useTranslation();
  const currency = usePreferencesStore((s) => s.currency);
  const { monthlyReports, fetchMonthlyReports, loading } = useReportsStore();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchMonthlyReports(currentYear);
  }, [fetchMonthlyReports]);

  const totalIncome = monthlyReports.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = monthlyReports.reduce((sum, d) => sum + d.expense, 0);
  const netIncome = totalIncome - totalExpense;

  return (
    <AnimatedPage>
      <StaggerContainer className="space-y-8">
        <StaggerItem>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-heading text-headline-md text-on-surface">{t("reports.title")}</h1>
            <div className="flex items-center gap-3">
              <div className="flex bg-surface-container-low rounded-xl p-1">
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-surface-container-highest text-on-surface shadow-sm">
                  {t("reports.monthly")}
                </button>
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface">
                  {t("reports.yearly")}
                </button>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors">
                <Download className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
            </div>
          </div>
        </StaggerItem>

        {/* Summary Cards */}
        <StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-tonal border-b-4 border-b-primary">
              <p className="text-label-sm text-on-surface-variant">{t("reports.totalIncome")}</p>
              <p className="font-heading text-2xl font-bold text-on-surface mt-1">{formatCurrency(totalIncome, currency)}</p>
            </div>
            <div className="card-tonal border-b-4 border-b-tertiary">
              <p className="text-label-sm text-on-surface-variant">{t("reports.totalExpense")}</p>
              <p className="font-heading text-2xl font-bold text-on-surface mt-1">{formatCurrency(totalExpense, currency)}</p>
            </div>
            <div className="card-tonal border-b-4 border-b-secondary">
              <p className="text-label-sm text-on-surface-variant">{t("reports.netIncome")}</p>
              <p className="font-heading text-2xl font-bold text-on-surface mt-1">{formatCurrency(netIncome, currency)}</p>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="card-tonal">
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-6">{t("reports.trendAnalysis")}</h3>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center text-on-surface-variant">
              Loading...
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyReports} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant) / 0.15)" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--on-surface-variant))" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--on-surface-variant))" }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} width={45} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0), currency)}
                      contentStyle={{ background: "hsl(var(--surface-container-lowest))", border: "none", borderRadius: "0.75rem", boxShadow: "0 4px 24px hsl(var(--on-surface) / 0.06)" }}
                    />
                    <Line type="monotone" name={t("dashboard.income")} dataKey="income" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                    <Line type="monotone" name={t("dashboard.expense")} dataKey="expense" stroke="hsl(var(--tertiary))" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          )}
        </StaggerItem>
      </StaggerContainer>
    </AnimatedPage>
  );
}
