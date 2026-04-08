"use client";

import { useState, useEffect } from "react";
import { CrudModal, ModalField, ModalInput, ModalSelect } from "@/components/common/CrudModal";
import type { Budget } from "@/types";
import { budgetsApi } from "@/lib/api";

const CATEGORY_OPTIONS = [
  { value: "Makanan & Minuman", label: "🍜 Makanan & Minuman" },
  { value: "Transportasi", label: "🚗 Transportasi" },
  { value: "Tagihan", label: "🏠 Tagihan" },
  { value: "Belanja", label: "🛍️ Belanja" },
  { value: "Hiburan", label: "📺 Hiburan" },
  { value: "Kesehatan", label: "❤️ Kesehatan" },
  { value: "Pendidikan", label: "📚 Pendidikan" },
  { value: "Lainnya", label: "📦 Lainnya" },
];

const ICON_MAP: Record<string, string> = {
  "Makanan & Minuman": "utensils",
  Transportasi: "car",
  Tagihan: "home",
  Belanja: "shopping-bag",
  Hiburan: "tv",
  Kesehatan: "heart",
  Pendidikan: "book",
  Lainnya: "banknote",
};

const COLOR_OPTIONS = [
  { value: "#3525cd", label: "Indigo" },
  { value: "#006c49", label: "Hijau" },
  { value: "#960014", label: "Merah" },
  { value: "#4f46e5", label: "Ungu" },
  { value: "#f59e0b", label: "Kuning" },
  { value: "#6cf8bb", label: "Mint" },
];

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  budget?: Budget | null;
  onSaved?: () => void;
  onDelete?: (id: string) => void;
}

export function BudgetModal({ open, onClose, budget, onSaved, onDelete }: BudgetModalProps) {
  const isEdit = !!budget;
  const [category, setCategory] = useState("Makanan & Minuman");
  const [limit, setLimit] = useState("");
  const [color, setColor] = useState("#3525cd");
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setLimit(String(budget.limit));
      setColor(budget.color);
    } else {
      setCategory("Makanan & Minuman");
      setLimit("");
      setColor("#3525cd");
    }
    setShowDelete(false);
  }, [budget, open]);

  const handleSave = async () => {
    if (!category || !limit) return;
    setIsLoading(true);
    try {
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const basePayload = {
        category,
        icon: ICON_MAP[category] || "banknote",
        limit: parseFloat(limit),
        color,
      };

      if (budget?.id) {
        await budgetsApi.update(budget.id, basePayload);
      } else {
        await budgetsApi.create({
          ...basePayload,
          period,
        });
      }

      await onSaved?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!budget) return;
    setIsLoading(true);
    try {
      if (onDelete) {
        await onDelete(budget.id);
      } else {
        await budgetsApi.delete(budget.id);
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
        title="Hapus Anggaran"
        onSubmit={handleDelete}
        submitLabel="Hapus"
        isLoading={isLoading}
        variant="danger"
      >
        <p className="text-sm text-on-surface-variant">
          Yakin ingin menghapus anggaran <strong className="text-on-surface">&ldquo;{budget?.category}&rdquo;</strong>?
        </p>
      </CrudModal>
    );
  }

  return (
    <CrudModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Anggaran" : "Tambah Anggaran"}
      onSubmit={handleSave}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <ModalField label="Kategori">
          <ModalSelect value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
        </ModalField>

        <ModalField label="Batas Anggaran (Rp)">
          <ModalInput value={limit} onChange={setLimit} type="number" placeholder="0" prefix="Rp" />
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
            Hapus Anggaran
          </button>
        )}
      </div>
    </CrudModal>
  );
}
