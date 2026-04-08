"use client";

import { useState, useEffect } from "react";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useBudgetsStore } from "@/store/useBudgetsStore";
import { formatCurrency } from "@/lib/currency";
import type { Budget } from "@/types";
import { BudgetModal } from "@/components/features/budget/BudgetModal";
import { Plus, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

function BudgetIcon({ icon, color }: { icon: string; color: string }) {
  const iconName = icon
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") as keyof typeof LucideIcons;
  const Icon = (LucideIcons[iconName] as React.ElementType) || LucideIcons.Wallet;
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}20` }}
    >
      <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
    </div>
  );
}

export default function BudgetPage() {
  const { t } = useTranslation();
  const { currency } = usePreferencesStore();
  const { budgets, fetchBudgets, deleteBudget } = useBudgetsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Budget | null>(null);

  useEffect(() => {
    // Get current period (YYYY-MM)
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    fetchBudgets({ period });
  }, [fetchBudgets]);

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const handleDelete = async (id: string) => {
    await deleteBudget(id);
  };

  const handleSaved = async () => {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await fetchBudgets({ period });
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (b: Budget) => { setEditTarget(b); setModalOpen(true); };

  return (
    <AnimatedPage>
      <StaggerContainer className="space-y-6">
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-headline-md text-on-surface">
                {t("budget.title")}
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">{budgets.length} kategori anggaran</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="btn-gradient px-5 py-2.5 text-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              {t("budget.addBudget")}
            </motion.button>
          </div>
        </StaggerItem>

        {/* Summary cards */}
        <StaggerItem className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t("budget.totalBudget"), value: totalBudget, color: "text-on-surface" },
            { label: t("budget.spent"), value: totalSpent, color: "text-tertiary" },
            { label: t("budget.remaining"), value: totalRemaining, color: "text-secondary" },
          ].map((item) => (
            <div key={item.label} className="card-tonal">
              <p className="text-label-sm text-on-surface-variant">{item.label}</p>
              <p className={cn("text-xl sm:text-2xl font-bold mt-2 font-heading tabular-nums", item.color)}>
                {formatCurrency(item.value, currency)}
              </p>
            </div>
          ))}
        </StaggerItem>

        {/* Budget categories */}
        <StaggerItem>
          <h2 className="font-heading text-lg font-semibold text-on-surface mb-4">{t("budget.categories")}</h2>
          <div className="space-y-3">
            {budgets.map((budget) => {
              const pct = Math.min((budget.spent / budget.limit) * 100, 100);
              const isOver = budget.spent > budget.limit;
              return (
                <motion.div
                  key={budget.id}
                  whileHover={{ scale: 1.005 }}
                  onClick={() => openEdit(budget)}
                  className="card-tonal cursor-pointer group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <BudgetIcon icon={budget.icon} color={budget.color} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium text-on-surface truncate">{budget.category}</span>
                          {isOver && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-medium shrink-0">
                              Melebihi
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn("text-sm font-semibold tabular-nums", isOver ? "text-tertiary" : "text-on-surface")}>
                            {Math.round(pct)}%
                          </span>
                          <Pencil className="w-3.5 h-3.5 text-on-surface-variant/0 group-hover:text-on-surface-variant/50 transition-all" />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: isOver ? "#960014" : budget.color }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-on-surface-variant">
                          {formatCurrency(budget.spent, currency)}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          / {formatCurrency(budget.limit, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </StaggerItem>
      </StaggerContainer>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        budget={editTarget}
        onSaved={handleSaved}
        onDelete={handleDelete}
      />
    </AnimatedPage>
  );
}
