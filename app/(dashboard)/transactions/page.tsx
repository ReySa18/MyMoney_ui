"use client";

import { useState, useEffect } from "react";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { formatCurrency } from "@/lib/currency";
import { mockTransactions } from "@/mocks/data";
import type { Transaction } from "@/types";
import { TransactionModal } from "@/components/features/transactions/TransactionModal";
import { Search, Plus, Filter, ArrowUpRight, ArrowDownLeft, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  utensils: "🍜",
  car: "🚗",
  banknote: "💰",
  "shopping-bag": "🛍️",
  home: "🏠",
  tv: "📺",
  coffee: "☕",
  wifi: "📶",
  "trending-up": "📈",
  heart: "❤️",
};

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { currency } = usePreferencesStore();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, startDate, endDate]);

  const filtered = transactions.filter((tx) => {
    const matchFilter =
      filter === "all" ||
      (filter === "income" && tx.type === "income") ||
      (filter === "expense" && tx.type === "expense");
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    
    let matchDate = true;
    if (startDate) matchDate = matchDate && tx.date >= startDate;
    if (endDate) matchDate = matchDate && tx.date <= endDate;
    
    return matchFilter && matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSave = (data: Transaction) => {
    setTransactions((prev) => {
      const idx = prev.findIndex((t) => t.id === data.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = data;
        return next;
      }
      return [data, ...prev];
    });
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (tx: Transaction) => { setEditTarget(tx); setModalOpen(true); };

  return (
    <AnimatedPage>
      <StaggerContainer className="space-y-6">
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-headline-md text-on-surface">
                {t("transactions.title")}
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">{transactions.length} transaksi tercatat</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="btn-gradient px-5 py-2.5 text-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Transaksi</span>
              <span className="sm:hidden">Tambah</span>
            </motion.button>
          </div>
        </StaggerItem>

        {/* Search + Filter */}
        <StaggerItem className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <Search className="w-4 h-4 text-on-surface-variant shrink-0" strokeWidth={1.5} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("transactions.search")}
                className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar shrink-0">
              {(["all", "income", "expense"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border",
                    filter === f
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:bg-surface-container"
                  )}
                >
                  {f === "all" ? t("transactions.all") : f === "income" ? t("transactions.incomeOnly") : t("transactions.expenseOnly")}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <span className="text-sm font-medium text-on-surface-variant">Mulai:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm font-medium text-on-surface outline-none cursor-pointer min-w-[120px]"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <span className="text-sm font-medium text-on-surface-variant">Hingga:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm font-medium text-on-surface outline-none cursor-pointer min-w-[120px]"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-sm text-tertiary hover:underline font-medium px-2"
              >
                Reset
              </button>
            )}
          </div>
        </StaggerItem>

        {/* Transaction list */}
        <StaggerItem className="card-tonal !p-0 overflow-hidden">
          {/* Table header — desktop only */}
          <div className="hidden sm:grid grid-cols-[3fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 bg-surface-container border-b border-outline-variant/10">
            <span className="text-label-sm text-on-surface-variant">{t("transactions.description")}</span>
            <span className="text-label-sm text-on-surface-variant text-left">{t("transactions.category")}</span>
            <span className="text-label-sm text-on-surface-variant text-left">{t("transactions.date")}</span>
            <span className="text-label-sm text-on-surface-variant text-right pr-8">{t("transactions.amount")}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-on-surface-variant">{t("transactions.noTransactions")}</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-outline-variant/10">
                {paginated.map((tx) => (
                  <motion.div
                    key={tx.id}
                    whileHover={{ backgroundColor: "hsl(var(--surface-container-low)/0.5)" }}
                    onClick={() => openEdit(tx)}
                    className="flex flex-col sm:grid sm:grid-cols-[3fr_1.5fr_1fr_1fr] sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer group"
                  >
                  {/* Col 1: Icon + Description */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                      tx.type === "income" ? "bg-secondary/10" : "bg-tertiary/10"
                    )}>
                      {CATEGORY_ICONS[tx.categoryIcon] || "💸"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-on-surface-variant">{tx.account}</span>
                        {/* Meta items stringed together for mobile view */}
                        <span className="text-xs text-on-surface-variant/40 sm:hidden">·</span>
                        <span className="text-xs text-on-surface-variant sm:hidden">{tx.date}</span>
                        <span className="text-xs text-on-surface-variant sm:hidden">· {tx.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Category badge */}
                  <div className="hidden sm:flex justify-start">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">
                      {tx.category}
                    </span>
                  </div>

                  {/* Col 3: Date */}
                  <div className="hidden sm:block text-sm text-on-surface-variant">
                    {tx.date}
                  </div>

                  {/* Col 4: Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        tx.type === "income" ? "bg-secondary/10" : "bg-tertiary/10"
                      )}>
                        {tx.type === "income"
                          ? <ArrowDownLeft className="w-3 h-3 text-secondary" />
                          : <ArrowUpRight className="w-3 h-3 text-tertiary" />}
                      </div>
                      <span className={cn(
                        "text-sm font-semibold tabular-nums",
                        tx.type === "income" ? "text-secondary" : "text-on-surface"
                      )}>
                        {tx.type === "income" ? "+" : ""}
                        {formatCurrency(Math.abs(tx.amount), currency)}
                      </span>
                    </div>
                    {/* The pencil icon will stay at the very end consistently */}
                    <div className="w-4 h-4 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Pencil className="w-3.5 h-3.5 text-on-surface-variant/60 hover:text-on-surface-variant" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10">
                <span className="text-sm text-on-surface-variant">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} transaksi
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-container hover:bg-surface-container-high disabled:opacity-50 transition-colors"
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-container hover:bg-surface-container-high disabled:opacity-50 transition-colors"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
          )}
        </StaggerItem>
      </StaggerContainer>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={editTarget}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AnimatedPage>
  );
}
