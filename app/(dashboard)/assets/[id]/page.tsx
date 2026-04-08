"use client";

import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { assetsApi } from "@/lib/api";
import type { Asset } from "@/types";
import { formatCurrency, formatPercentage } from "@/lib/currency";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AssetDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const currency = usePreferencesStore((s) => s.currency);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await assetsApi.getById(params.id as string);
        setAsset(data);
      } catch (error) {
        console.error("Failed to fetch asset:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [params.id]);

  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center h-64 text-on-surface-variant">
          Loading...
        </div>
      </AnimatedPage>
    );
  }

  if (!asset) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center h-64 text-on-surface-variant">
          Asset not found
        </div>
      </AnimatedPage>
    );
  }

  const isPositive = asset.change >= 0;

  return (
    <AnimatedPage>
      <div className="space-y-8">
        {/* Back button */}
        <Link href="/assets" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("assets.title")}
        </Link>

        {/* Header */}
        <div className="card-elevated">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant mb-1">{asset.type}</p>
              <h1 className="font-heading text-2xl font-bold text-on-surface">{asset.name}</h1>
              <h2 className="font-heading text-3xl font-bold text-on-surface mt-2">
                {formatCurrency(asset.value, currency)}
              </h2>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
              isPositive ? "bg-secondary/10 text-secondary" : "bg-tertiary/10 text-tertiary"
            }`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercentage(asset.change)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="card-tonal">
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-6">
            {t("assets.history")}
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={asset.history}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={asset.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={asset.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--outline-variant) / 0.15)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--on-surface-variant))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--on-surface-variant))" }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} width={45} />
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0), currency)} contentStyle={{ background: "hsl(var(--surface-container-lowest))", border: "none", borderRadius: "0.75rem", boxShadow: "0 4px 24px hsl(var(--on-surface) / 0.06)" }} />
                <Area type="monotone" dataKey="value" stroke={asset.color} strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History table */}
        <div className="card-tonal">
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-4">
            {t("assets.performance")}
          </h3>
          <div className="space-y-3">
            {asset.history.map((h, i) => {
              const prevValue = i > 0 ? asset.history[i - 1].value : h.value;
              const change = ((h.value - prevValue) / prevValue) * 100;
              return (
                <div key={h.date} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors">
                  <span className="text-sm text-on-surface-variant">{h.date}</span>
                  <span className="text-sm font-semibold text-on-surface">{formatCurrency(h.value, currency)}</span>
                  <span className={`text-xs font-semibold ${change >= 0 ? "text-secondary" : "text-tertiary"}`}>
                    {i > 0 ? formatPercentage(change) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
