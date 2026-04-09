"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useCashflow } from "@/lib/hooks/useDashboard";
import { formatCurrency } from "@/lib/currency";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CashFlowChart() {
  const { t } = useTranslation();
  const currency = usePreferencesStore((s) => s.currency);
  const { data: cashflow = [], isLoading: loading } = useCashflow();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-tonal-lg border border-outline-variant/10">
          <p className="text-label-sm text-on-surface-variant mb-2">{label}</p>
          {payload.map((entry: { name: string; value: number; color: string }, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-on-surface-variant">{entry.name}:</span>
              <span className="font-semibold text-on-surface">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-tonal h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-on-surface">
            {t("dashboard.cashFlow")}
          </h3>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            {t("dashboard.cashFlowPeriod")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-on-surface-variant">{t("dashboard.income")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-tertiary" />
            <span className="text-xs text-on-surface-variant">{t("dashboard.expense")}</span>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-on-surface-variant">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cashflow}
              barGap={4}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--outline-variant) / 0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--on-surface-variant))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--on-surface-variant))" }}
                tickFormatter={(v) =>
                  `${(v / 1_000_000).toFixed(0)}jt`
                }
                width={45}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--surface-container) / 0.5)" }} />
              <Bar
                dataKey="income"
                name={t("dashboard.income")}
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="expense"
                name={t("dashboard.expense")}
                fill="hsl(var(--tertiary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
