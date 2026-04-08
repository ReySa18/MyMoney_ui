"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";
import idLocale from "@/locales/id.json";
import enLocale from "@/locales/en.json";
import { useCallback } from "react";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

type LocaleKeys = NestedKeyOf<typeof idLocale>;

const locales = {
  id: idLocale,
  en: enLocale,
} as const;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function useTranslation() {
  const language = usePreferencesStore((s) => s.language);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = getNestedValue(
        locales[language] as unknown as Record<string, unknown>,
        key
      );
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [language]
  );

  return { t, language };
}
