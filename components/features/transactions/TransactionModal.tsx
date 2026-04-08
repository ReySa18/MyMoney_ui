"use client";

import { useState, useEffect } from "react";
import { CrudModal, ModalField, ModalInput, ModalSelect } from "@/components/common/CrudModal";
import type { Transaction } from "@/types";
import { transactionsApi } from "@/lib/api";
import { useAccountsStore } from "@/store/useAccountsStore";

const CATEGORIES = [
  { value: "Makanan & Minuman", label: "🍜 Makanan & Minuman" },
  { value: "Transportasi", label: "🚗 Transportasi" },
  { value: "Belanja", label: "🛍️ Belanja" },
  { value: "Tagihan", label: "🏠 Tagihan" },
  { value: "Hiburan", label: "📺 Hiburan" },
  { value: "Kesehatan", label: "❤️ Kesehatan" },
  { value: "Pemasukan", label: "💰 Pemasukan" },
  { value: "Lainnya", label: "📦 Lainnya" },
];

// Accounts come from DB via useAccountsStore.

const ICON_MAP: Record<string, string> = {
  "Makanan & Minuman": "utensils",
  Transportasi: "car",
  Belanja: "shopping-bag",
  Tagihan: "home",
  Hiburan: "tv",
  Kesehatan: "heart",
  Pemasukan: "banknote",
  Lainnya: "banknote",
};

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  onSaved?: () => void;
  onDelete?: (id: string) => void;
}

export function TransactionModal({
  open,
  onClose,
  transaction,
  onSaved,
  onDelete,
}: TransactionModalProps) {
  const isEdit = !!transaction;
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Makanan & Minuman");
  const { accounts, fetchAccounts } = useAccountsStore();
  const [accountId, setAccountId] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    // Ensure accounts are loaded for the select.
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(String(Math.abs(transaction.amount)));
      setType(transaction.type);
      setCategory(transaction.category);
      setAccountId(transaction.accountId);
      setDate(transaction.date);
    } else {
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Makanan & Minuman");
      setAccountId(accounts[0]?.id || "");
      setDate(new Date().toISOString().split("T")[0]);
    }
    setShowDelete(false);
  }, [transaction, open, accounts]);

  const handleSave = async () => {
    if (!description || !amount || !accountId) return;
    setIsLoading(true);
    try {
      const numAmount = parseFloat(amount);
      const basePayload = {
        description,
        amount: Math.abs(numAmount),
        type,
        category,
        category_icon: ICON_MAP[category] || "banknote",
        date,
      };

      if (transaction?.id) {
        await transactionsApi.update(transaction.id, basePayload);
      } else {
        await transactionsApi.create({
          ...basePayload,
          account_id: accountId,
        });
      }

      await onSaved?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    setIsLoading(true);
    try {
      if (onDelete) {
        await onDelete(transaction.id);
      } else {
        await transactionsApi.delete(transaction.id);
      }
      await onSaved?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (showDelete) {
    return (
      <CrudModal
        open={open}
        onClose={() => { setShowDelete(false); onClose(); }}
        title="Hapus Transaksi"
        onSubmit={handleDelete}
        submitLabel="Hapus"
        isLoading={isLoading}
        variant="danger"
      >
        <p className="text-sm text-on-surface-variant">
          Yakin ingin menghapus transaksi <strong className="text-on-surface">&ldquo;{transaction?.description}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
      </CrudModal>
    );
  }

  return (
    <CrudModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Transaksi" : "Tambah Transaksi"}
      onSubmit={handleSave}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {/* Type toggle */}
        <ModalField label="Jenis">
          <div className="flex gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  type === t
                    ? t === "income"
                      ? "bg-secondary text-white"
                      : "bg-tertiary text-white"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {t === "income" ? "Pemasukan" : "Pengeluaran"}
              </button>
            ))}
          </div>
        </ModalField>

        <ModalField label="Deskripsi">
          <ModalInput value={description} onChange={setDescription} placeholder="Nama transaksi..." />
        </ModalField>

        <ModalField label="Jumlah (Rp)">
          <ModalInput value={amount} onChange={setAmount} type="number" placeholder="0" prefix="Rp" />
        </ModalField>

        <div className="grid grid-cols-2 gap-3">
          <ModalField label="Kategori">
            <ModalSelect value={category} onChange={setCategory} options={CATEGORIES} />
          </ModalField>
          <ModalField label="Akun">
            <ModalSelect
              value={accountId}
              onChange={setAccountId}
              options={accounts.map((a) => ({ value: a.id, label: a.name }))}
            />
          </ModalField>
        </div>

        <ModalField label="Tanggal">
          <ModalInput value={date} onChange={setDate} type="date" />
        </ModalField>

        {isEdit && onDelete && (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-tertiary hover:bg-tertiary/5 transition-colors border border-tertiary/20"
          >
            Hapus Transaksi
          </button>
        )}
      </div>
    </CrudModal>
  );
}
