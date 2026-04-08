"use client";

import { AnimatedPage, StaggerContainer, StaggerItem } from "@/components/common/AnimatedPage";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { User, Bell, Shield, Globe, CreditCard, Palette, LogOut, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { EditProfileModal } from "@/components/features/settings/EditProfileModal";
import { ChangePasswordModal } from "@/components/features/settings/ChangePasswordModal";

export default function SettingsPage() {
  const { t, language } = useTranslation();
  const { currency, setCurrency, setLanguage } = usePreferencesStore();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <AnimatedPage>
      <StaggerContainer className="max-w-4xl space-y-8">
        <StaggerItem>
          <h1 className="font-heading text-headline-md text-on-surface">{t("settings.title")}</h1>
        </StaggerItem>

        {/* Profile Section */}
        <StaggerItem className="card-tonal">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 ring-4 ring-primary/10">
              {user?.avatar && <AvatarImage src={user.avatar} className="object-cover" />}
              <AvatarFallback className="bg-primary-container text-white text-2xl font-semibold">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-bold text-on-surface">{user?.name}</h2>
              <p className="text-sm text-on-surface-variant mt-1">{user?.email}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setIsEditProfileOpen(true)} className="btn-gradient px-5 py-2 text-sm">{t("common.edit")} Profile</button>
                <button onClick={() => { logout(); window.location.href = '/login'; }} className="px-5 py-2 rounded-full border border-outline/20 text-on-surface hover:bg-surface-container transition-colors text-sm flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </StaggerItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferences */}
          <StaggerItem className="card-tonal">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-on-surface mb-6">
              <Palette className="w-5 h-5 text-primary" /> {t("settings.preferences")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                <div>
                  <p className="text-sm font-medium text-on-surface">{t("settings.theme")}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{mounted ? (theme === 'dark' ? t("settings.darkMode") : t("settings.lightMode")) : "..."}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer" onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}>
                <div>
                  <p className="text-sm font-medium text-on-surface">{t("settings.language")}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 uppercase">{language === 'id' ? 'Bahasa Indonesia' : 'English'}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer" onClick={() => setCurrency(currency === 'IDR' ? 'USD' : 'IDR')}>
                <div>
                  <p className="text-sm font-medium text-on-surface">{t("settings.currency")}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{currency}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
          </StaggerItem>

          {/* Security */}
          <StaggerItem className="card-tonal">
            <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-on-surface mb-6">
              <Shield className="w-5 h-5 text-secondary" /> {t("settings.security")}
            </h3>
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">{t("settings.changePassword")}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Last changed 3 months ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-on-surface">Two-Factor Authentication</p>
                  <p className="text-xs text-secondary font-medium mt-0.5">Enabled</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            </div>
          </StaggerItem>
        </div>
      </StaggerContainer>

      <EditProfileModal open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
      <ChangePasswordModal open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </AnimatedPage>
  );
}
