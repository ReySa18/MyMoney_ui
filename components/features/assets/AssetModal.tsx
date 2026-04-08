"use client";

import { useState, useEffect } from "react";
import { CrudModal, ModalField, ModalInput, ModalSelect } from "@/components/common/CrudModal";
import type { Asset } from "@/types";

const ASSET_TYPES = [
  { value: "Saham", label: "📈 Saham" },
  { value: "Reksa Dana", label: "🥧 Reksa Dana" },
  { value: "Emas", label: "🥇 Emas" },
  { value: "Deposito", label: "🔒 Deposito" },
  { value: "Crypto", label: "₿ Crypto" },
  { value: "Properti", label: "🏠 Properti" },
  { value: "Obligasi", label: "📄 Obligasi" },
];

const ICON_MAP: Record<string, string> = {
  Saham: "trending-up",
  "Reksa Dana": "pie-chart",
  Emas: "gem",
  Deposito: "lock",
  Crypto: "bitcoin",
  Properti: "home",
  Obligasi: "file-text",
};

const COLOR_OPTIONS = [
  { value: "#3525cd", label: "Indigo" },
  { value: "#006c49", label: "Hijau" },
  { value: "#960014", label: "Merah" },
  { value: "#4f46e5", label: "Ungu" },
  { value: "#f59e0b", label: "Emas" },
  { value: "#0ea5e9", label: "Biru" },
];

interface AssetModalProps {
  open: boolean;
  onClose: () => void;
  asset?: Asset | null;
  onSave: (data: Asset) => void;
  onDelete?: (id: string) => void;
}

export function AssetModal({ open, onClose, asset, onSave, onDelete }: AssetModalProps) {
  const isEdit = !!asset;
  const [name, setName] = useState("");
  const [type, setType] = useState("Saham");
  const [value, setValue] = useState("");
  const [allocation, setAllocation] = useState("");
  const [color, setColor] = useState("#3525cd");
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setType(asset.type);
      setValue(String(asset.value));
      setAllocation(String(asset.allocation));
      setColor(asset.color);
    } else {
      setName("");
      setType("Saham");
      setValue("");
      setAllocation("");
      setColor("#3525cd");
    }
    setShowDelete(false);
  }, [asset, open]);

  const handleSave = async () => {
    if (!name || !value) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const today = new Date().toISOString().slice(0, 7);
    onSave({
      id: asset?.id || Date.now().toString(),
      name,
      type,
      value: parseFloat(value),
      allocation: parseFloat(allocation) || 0,
      change: asset?.change || 0,
      icon: ICON_MAP[type] || "trending-up",
      color,
      history: asset?.history || [{ date: today, value: parseFloat(value) }],
    });
    setIsLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!asset) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onDelete?.(asset.id);
    setIsLoading(false);
    onClose();
  };

  if (showDelete) {
    return (
      <CrudModal
        open={open}
        onClose={() => { setShowDelete(false); onClose(); }}
        title="Hapus Aset"
        onSubmit={handleDelete}
        submitLabel="Hapus"
        isLoading={isLoading}
        variant="danger"
      >
        <p className="text-sm text-on-surface-variant">
          Yakin ingin menghapus aset <strong className="text-on-surface">&ldquo;{asset?.name}&rdquo;</strong>?
        </p>
      </CrudModal>
    );
  }

  return (
    <CrudModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Aset" : "Tambah Aset"}
      onSubmit={handleSave}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <ModalField label="Nama Aset">
          <ModalInput value={name} onChange={setName} placeholder="Cth: Saham BBCA" />
        </ModalField>

        <ModalField label="Jenis Aset">
          <ModalSelect value={type} onChange={setType} options={ASSET_TYPES} />
        </ModalField>

        <div className="grid grid-cols-2 gap-3">
          <ModalField label="Nilai Saat Ini (Rp)">
            <ModalInput value={value} onChange={setValue} type="number" placeholder="0" prefix="Rp" />
          </ModalField>
          <ModalField label="Alokasi (%)">
            <ModalInput value={allocation} onChange={setAllocation} type="number" placeholder="0" prefix="%" />
          </ModalField>
        </div>

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
            Hapus Aset
          </button>
        )}
      </div>
    </CrudModal>
  );
}
