"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface CrudModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  variant?: "default" | "danger";
}

export function CrudModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Simpan",
  isLoading = false,
  variant = "default",
}: CrudModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="!bg-surface-container-lowest !rounded-2xl !ring-outline-variant/10 !p-0 sm:!max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/10">
          <DialogTitle className="font-heading text-lg font-semibold text-on-surface">
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {onSubmit && (
          <div className="px-6 pb-6 pt-2 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <motion.button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-60 ${
                variant === "danger"
                  ? "bg-tertiary hover:bg-tertiary/90"
                  : "btn-gradient"
              }`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                submitLabel
              )}
            </motion.button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Reusable field component
export function ModalField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-label-sm text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}

// Reusable input component for modals
export function ModalInput({
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-low focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-primary/40 transition-all">
      {prefix && (
        <span className="text-sm text-on-surface-variant shrink-0">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
      />
    </div>
  );
}

export function ModalSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-surface-container-low text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 transition-all"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
