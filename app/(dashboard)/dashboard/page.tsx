"use client";

import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { BalanceCard } from "@/components/features/dashboard/BalanceCard";
import { CashFlowChart } from "@/components/features/dashboard/CashFlowChart";
import { AccountList } from "@/components/features/dashboard/AccountList";
import { RecentTransactions } from "@/components/features/dashboard/RecentTransactions";
import { ExpenseAllocation } from "@/components/features/dashboard/ExpenseAllocation";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/useAuthStore";
import { TransactionModal } from "@/components/features/transactions/TransactionModal";
import { usePrefetchWarmup } from "@/lib/hooks/usePrefetchWarmup";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [modalOpen, setModalOpen] = useState(false);

  // Prefetch background halaman lain saat browser idle
  usePrefetchWarmup();

  // Tidak perlu manual fetch — React Query invalidate otomatis via mutation hooks
  const handleSaved = () => {};

  return (
    <AnimatedPage>
      <StaggerContainer className="space-y-6 lg:space-y-8">
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-headline-md text-on-surface">
                {t("dashboard.title")}
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1">
                Selamat datang kembali, {user?.name?.split(" ")[0] || "Andi"} 👋
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="btn-gradient px-5 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t("dashboard.addTransaction")}</span>
              <span className="sm:hidden">Tambah</span>
            </motion.button>
          </div>
        </StaggerItem>

        {/* Balance Cards */}
        <StaggerItem>
          <BalanceCard />
        </StaggerItem>

        {/* Chart + Accounts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          <StaggerItem className="xl:col-span-2">
            <CashFlowChart />
          </StaggerItem>
          <StaggerItem>
            <AccountList />
          </StaggerItem>
        </div>

        {/* Transactions + Budget allocation */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          <StaggerItem className="xl:col-span-2">
            <RecentTransactions />
          </StaggerItem>
          <StaggerItem>
            <ExpenseAllocation />
          </StaggerItem>
        </div>
      </StaggerContainer>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </AnimatedPage>
  );
}
