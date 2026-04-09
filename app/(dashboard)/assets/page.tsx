"use client";

import { useState } from "react";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useAssets, useDeleteAsset } from "@/lib/hooks/useAssets";
import { formatCurrency } from "@/lib/currency";
import type { Asset } from "@/types";
import { AssetModal } from "@/components/features/assets/AssetModal";
import {
  PieChart,
  Cell,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Plus, Pencil } from "lucide-react";
import { motion } from "framer-motion";

export default function AssetsPage() {
  const { t } = useTranslation();
  const { currency } = usePreferencesStore();
  const { data: assets = [] } = useAssets();
  const { mutateAsync: deleteAsset } = useDeleteAsset();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Asset | null>(null);

  const totalValue = assets.reduce((s, a) => s + a.value, 0);

  const handleDelete = async (id: string) => {
    await deleteAsset(id);
  };

  // Invalidasi otomatis via React Query mutation — tidak perlu manual fetch
  const handleSaved = () => {};

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (a: Asset) => { setEditTarget(a); setModalOpen(true); };

  return (
    <AnimatedPage>
      <StaggerContainer className="space-y-6">
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-headline-md text-on-surface">{t("assets.title")}</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                {t("assets.totalValue")}: <strong className="text-on-surface">{formatCurrency(totalValue, currency)}</strong>
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="btn-gradient px-5 py-2.5 text-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Tambah Aset
            </motion.button>
          </div>
        </StaggerItem>

        {/* Chart + Legend */}
        <StaggerItem className="card-tonal">
          <h2 className="font-heading text-lg font-semibold text-on-surface mb-6">{t("assets.allocation")}</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-64 h-56 shrink-0 relative flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assets}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    strokeWidth={0}
                  >
                    {assets.map((a) => (
                      <Cell key={a.id} fill={a.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatCurrency(Number(v ?? 0), currency)}
                    contentStyle={{
                      background: "hsl(var(--surface-container-lowest))",
                      border: "1px solid hsl(var(--outline-variant) / 0.2)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "hsl(var(--on-surface))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Label overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-on-surface-variant font-medium">Total</span>
                <span className="text-lg font-heading font-bold text-on-surface">100%</span>
              </div>
            </div>
            
            {/* Structured Legend Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 w-full">
              {assets.map((a) => (
                <div 
                  key={a.id} 
                  className="flex items-center justify-between p-3.5 rounded-2xl border transition-colors cursor-pointer group hover:opacity-90"
                  style={{
                    backgroundColor: `${a.color}15`,
                    borderColor: `${a.color}40`
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: a.color }} />
                    <span 
                      className="text-sm font-bold transition-colors truncate pr-2 drop-shadow-sm"
                      style={{ color: a.color }}
                    >
                      {a.name}
                    </span>
                  </div>
                  <span 
                    className="text-sm font-bold tabular-nums px-2 py-0.5 rounded-md" 
                    style={{ backgroundColor: `${a.color}25`, color: a.color }}
                  >
                    {a.allocation}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* Asset cards grid */}
        <StaggerItem className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openEdit(asset)}
              className="card-tonal cursor-pointer group relative overflow-hidden border"
              style={{
                backgroundColor: `${asset.color}0F`,
                borderColor: `${asset.color}30`
              }}
            >
              {/* Color accent top */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: asset.color }} />

              <div className="pt-2">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${asset.color}20` }}>
                    <span className="text-xl">
                      {asset.type === "Saham" ? "📈" : asset.type === "Reksa Dana" ? "🥧" : asset.type === "Emas" ? "🥇" : asset.type === "Deposito" ? "🔒" : "₿"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      asset.change >= 0 ? "bg-secondary/10 text-secondary" : "bg-tertiary/10 text-tertiary"
                    }`}>
                      {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {asset.change >= 0 ? "+" : ""}{asset.change}%
                    </div>
                    <Pencil className="w-4 h-4 text-on-surface-variant/0 group-hover:text-on-surface-variant/50 transition-all" />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-on-surface-variant">{asset.type}</p>
                  <h3 className="font-heading text-base font-semibold text-on-surface mt-0.5">{asset.name}</h3>
                </div>

                <div className="mt-3 pt-3 border-t border-outline-variant/10">
                  <p className="font-heading text-xl font-bold text-on-surface tabular-nums">
                    {formatCurrency(asset.value, currency)}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{asset.allocation}% alokasi aset</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add placeholder */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={openAdd}
            className="card-tonal cursor-pointer border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-3 py-10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Tambah Aset</span>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      <AssetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        asset={editTarget}
        onSaved={handleSaved}
        onDelete={handleDelete}
      />
    </AnimatedPage>
  );
}
