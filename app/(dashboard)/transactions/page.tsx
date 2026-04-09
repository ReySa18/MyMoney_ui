"use client";

import { useState } from "react";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useTransactions, useDeleteTransaction } from "@/lib/hooks/useTransactions";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { formatCurrency } from "@/lib/currency";
import type { Transaction } from "@/types";
import { TransactionModal } from "@/components/features/transactions/TransactionModal";
import { Search, Plus, ArrowUpRight, ArrowDownLeft, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

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

  // UI state — tetap di useState (bukan server-state)
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);

  // Debounce search 400ms — tidak request tiap keystroke
  const debouncedSearch = useDebounce(search, 400);

  // Server-state via React Query — keepPreviousData agar list tidak flicker saat ganti page
  const { data, isLoading, isFetching } = useTransactions(
    {
      type: filter !== "all" ? filter : undefined,
      search: debouncedSearch || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      page,
      limit: 8,
    },
    { placeholderData: keepPreviousData }
  );

  const transactions = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 0;

  // Mutations — invalidasi otomatis via hook
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  // Saat filter/search berubah, reset ke page 1
  const handleFilterChange = (f: "all" | "income" | "expense") => {
    setFilter(f);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleDateChange = (field: "start" | "end", val: string) => {
    if (field === "start") setStartDate(val);
    else setEndDate(val);
    setPage(1);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (tx: Transaction) => { setEditTarget(tx); setModalOpen(true); };

  // isFetching tapi ada data lama → tampilkan list lama dengan overlay subtle
  const loading = isLoading;
  const isRefetching = !isLoading && isFetching;

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
              <p className="text-sm text-on-surface-variant mt-1">
                {total} transaksi tercatat
              </p>
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
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("transactions.search")}
                className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar shrink-0">
              {(["all", "income", "expense"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
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
                onChange={(e) => handleDateChange("start", e.target.value)}
                className="bg-transparent text-sm font-medium text-on-surface outline-none cursor-pointer min-w-[120px]"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <span className="text-sm font-medium text-on-surface-variant">Hingga:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange("end", e.target.value)}
                className="bg-transparent text-sm font-medium text-on-surface outline-none cursor-pointer min-w-[120px]"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={handleReset}
                className="text-sm text-tertiary hover:underline font-medium px-2"
              >
                Reset
              </button>
            )}
          </div>
        </StaggerItem>

        {/* Transaction list */}
        <StaggerItem className={cn("card-tonal !p-0 overflow-hidden transition-opacity", isRefetching && "opacity-70")}>
          {/* Table header — desktop only */}
          <div className="hidden sm:grid grid-cols-[3fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 bg-surface-container border-b border-outline-variant/10">
            <span className="text-label-sm text-on-surface-variant">{t("transactions.description")}</span>
            <span className="text-label-sm text-on-surface-variant text-left">{t("transactions.category")}</span>
            <span className="text-label-sm text-on-surface-variant text-left">{t("transactions.date")}</span>
            <span className="text-label-sm text-on-surface-variant text-right pr-8">{t("transactions.amount")}</span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <p className="text-on-surface-variant">Loading...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-on-surface-variant">{t("transactions.noTransactions")}</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-outline-variant/10">
                {transactions.map((tx) => (
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
                    Halaman {page} dari {totalPages} ({total} transaksi)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface-container hover:bg-surface-container-high disabled:opacity-50 transition-colors"
                    >
                      Sebelumnya
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
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
        onSaved={() => {}}
        onDelete={handleDelete}
      />
    </AnimatedPage>
  );
}
