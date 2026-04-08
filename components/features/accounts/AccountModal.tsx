"use client";

import { useState, useEffect } from "react";
import { CrudModal, ModalField, ModalInput, ModalSelect } from "@/components/common/CrudModal";
import type { Account } from "@/types";
import { accountsApi } from "@/lib/api";

const TYPE_OPTIONS = [
  { value: "savings", label: "🏦 Tabungan" },
  { value: "ewallet", label: "📱 E-Wallet" },
  { value: "cash", label: "💵 Tunai" },
  { value: "investment", label: "📈 Investasi" },
  { value: "credit", label: "💳 Kartu Kredit" },
];

const ICON_MAP: Record<string, string> = {
  savings: "landmark",
  ewallet: "wallet",
  cash: "banknote",
  investment: "trending-up",
  credit: "credit",
};

const COLOR_OPTIONS = [
  { value: "#3525cd", label: "Indigo" },
  { value: "#006c49", label: "Hijau" },
  { value: "#960014", label: "Merah" },
  { value: "#4f46e5", label: "Ungu" },
  { value: "#f59e0b", label: "Kuning" },
  { value: "#6cf8bb", label: "Mint" },
  { value: "#0ea5e9", label: "Biru" },
];

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  account?: Account | null;
  onSaved?: () => void;
  onDelete?: (id: string) => void;
}

export function AccountModal({ open, onClose, account, onSaved, onDelete }: AccountModalProps) {
  const isEdit = !!account;
  const [name, setName] = useState("");
  const [type, setType] = useState<Account["type"]>("savings");
  const [balance, setBalance] = useState("");
  const [color, setColor] = useState("#3525cd");
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type);
      setBalance(String(account.balance));
      setColor(account.color);
    } else {
      setName("");
      setType("savings");
      setBalance("");
      setColor("#3525cd");
    }
    setShowDelete(false);
  }, [account, open]);

  const handleSave = async () => {
    if (!name || !balance) return;
    setIsLoading(true);
    try {
      const payload = {
        name,
        type,
        icon: ICON_MAP[type] || "landmark",
        balance: parseFloat(balance),
        color,
      };

      if (account?.id) {
        await accountsApi.update(account.id, payload);
      } else {
        await accountsApi.create(payload);
      }

      await onSaved?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      if (onDelete) {
        await onDelete(account.id);
      } else {
        await accountsApi.delete(account.id);
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
        title="Hapus Akun"
        onSubmit={handleDelete}
        submitLabel="Hapus"
        isLoading={isLoading}
        variant="danger"
      >
        <p className="text-sm text-on-surface-variant">
          Yakin ingin menghapus akun <strong className="text-on-surface">&ldquo;{account?.name}&rdquo;</strong>? Semua data terkait akan hilang.
        </p>
      </CrudModal>
    );
  }

  return (
    <CrudModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Akun" : "Tambah Akun"}
      onSubmit={handleSave}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <ModalField label="Nama Akun">
          <ModalInput value={name} onChange={setName} placeholder="Contoh: Bank BCA Utama" />
        </ModalField>

        <ModalField label="Jenis Akun">
          <ModalSelect
            value={type}
            onChange={(v) => setType(v as Account["type"])}
            options={TYPE_OPTIONS}
          />
        </ModalField>

        <ModalField label="Saldo (Rp)">
          <ModalInput value={balance} onChange={setBalance} type="number" placeholder="0" prefix="Rp" />
        </ModalField>

        <ModalField label="Warna">
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                title={c.label}
                className={`w-8 h-8 rounded-full transition-all ${
                  color === c.value ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </ModalField>

        {isEdit && onDelete && (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-tertiary hover:bg-tertiary/5 transition-colors border border-tertiary/20"
          >
            Hapus Akun
          </button>
        )}
      </div>
    </CrudModal>
  );
}
