"use client";

import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useAccountsStore } from "@/store/useAccountsStore";
import { formatCurrency } from "@/lib/currency";
import { Landmark, Wallet, Banknote, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  landmark: Landmark,
  wallet: Wallet,
  banknote: Banknote,
};

export function AccountList() {
  const { t } = useTranslation();
  const currency = usePreferencesStore((s) => s.currency);
  const { accounts, fetchAccounts, loading } = useAccountsStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const displayAccounts = accounts.slice(0, 3);

  return (
    <div className="card-tonal h-full flex flex-col">
      <h3 className="font-heading text-lg font-semibold text-on-surface mb-6">
        {t("dashboard.myAccounts")}
      </h3>

      <div className="flex-1 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-on-surface-variant">
            Loading...
          </div>
        ) : displayAccounts.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-on-surface-variant">
            {t("dashboard.noAccounts")}
          </div>
        ) : (
          displayAccounts.map((account, i) => {
            const Icon = iconMap[account.icon] || Landmark;
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${account.color}15` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: account.color }}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface">
                    {account.name}
                  </p>
                  <p className="text-xs text-on-surface-variant capitalize">
                    {account.type === "ewallet"
                      ? "E-Wallet"
                      : account.type === "savings"
                      ? "Savings"
                      : "Dompet"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-on-surface whitespace-nowrap">
                  {formatCurrency(account.balance, currency)}
                </p>
              </motion.div>
            );
          })
        )}
      </div>

      <Link href="/assets">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-sm font-medium text-primary cursor-pointer"
        >
          {t("dashboard.viewAllAssets")}
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </div>
  );
}
