"use client";

import { useState, useEffect } from "react";
import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useAccountsStore } from "@/store/useAccountsStore";
import { formatCurrency } from "@/lib/currency";
import type { Account } from "@/types";
import { AccountModal } from "@/components/features/accounts/AccountModal";
import { Plus, Landmark, Wallet, Banknote, TrendingUp, CreditCard, Pencil } from "lucide-react";
import { motion } from "framer-motion";

const ACCOUNT_ICONS: Record<string, React.ElementType> = {
  landmark: Landmark,
  wallet: Wallet,
  banknote: Banknote,
  "trending-up": TrendingUp,
  credit: CreditCard,
};

const TYPE_LABELS: Record<string, string> = {
  savings: "Tabungan",
  ewallet: "E-Wallet",
  cash: "Tunai",
  investment: "Investasi",
  credit: "Kartu Kredit",
};

export default function AccountsPage() {
  const { t } = useTranslation();
  const { currency } = usePreferencesStore();
  const { accounts, fetchAccounts, deleteAccount, loading } = useAccountsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const handleDelete = async (id: string) => {
    await deleteAccount(id);
  };

  const handleSaved = async () => {
    await fetchAccounts();
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (a: Account) => { setEditTarget(a); setModalOpen(true); };

  return (
    <AnimatedPage>
      <StaggerContainer className="space-y-6">
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-headline-md text-on-surface">
                {t("accounts.title")}
              </h1>
              <div className="mt-2">
                <p className="text-label-sm text-on-surface-variant">{t("accounts.totalBalance")}</p>
                <p className="font-heading text-2xl font-bold text-on-surface tabular-nums mt-1">
                  {formatCurrency(totalBalance, currency)}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="btn-gradient px-5 py-2.5 text-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              {t("accounts.addAccount")}
            </motion.button>
          </div>
        </StaggerItem>

        {/* Account cards grid */}
        <StaggerItem className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-on-surface-variant">
              Loading...
            </div>
          ) : (
            <>
              {accounts.map((account) => {
                const Icon = ACCOUNT_ICONS[account.icon] || Landmark;
                return (
              <motion.div
                key={account.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEdit(account)}
                className="card-tonal cursor-pointer group relative overflow-hidden"
              >
                {/* Color bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ backgroundColor: account.color }}
                />
                <div className="pt-2">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${account.color}20` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: account.color }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <Pencil className="w-4 h-4 text-on-surface-variant/0 group-hover:text-on-surface-variant/50 transition-all" />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-on-surface-variant">{TYPE_LABELS[account.type] || account.type}</p>
                    <h3 className="font-heading text-base font-semibold text-on-surface mt-0.5">
                      {account.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-outline-variant/10">
                    <p className="text-label-sm text-on-surface-variant">Saldo</p>
                    <p className="font-heading text-xl font-bold text-on-surface mt-1 tabular-nums">
                      {formatCurrency(account.balance, currency)}
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            })}

            {/* Add account placeholder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAdd}
              className="card-tonal cursor-pointer border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-3 py-10 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{t("accounts.addAccount")}</span>
            </motion.div>
          </>
          )}
        </StaggerItem>
      </StaggerContainer>

      <AccountModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        account={editTarget}
        onSaved={handleSaved}
        onDelete={handleDelete}
      />
    </AnimatedPage>
  );
}
