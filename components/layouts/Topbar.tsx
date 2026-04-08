"use client";

import { Bell, Search, Sun, Moon, Globe, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { t, language } = useTranslation();
  const setLanguage = usePreferencesStore((s) => s.setLanguage);
  const user = useAuthStore((s) => s.user);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 lg:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 gap-3">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search — hidden on very small screens */}
      <div className="flex-1 max-w-lg hidden sm:block">
        <motion.div
          animate={{
            backgroundColor: searchFocused
              ? "hsl(var(--surface-container-highest))"
              : "hsl(var(--surface-container-low))",
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
        >
          <Search
            className="w-4 h-4 text-on-surface-variant shrink-0"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder={t("common.search")}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none w-full"
          />
        </motion.div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Language toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setLanguage(language === "id" ? "en" : "id")}
          className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant"
        >
          <Globe className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase hidden sm:inline">
            {language}
          </span>
        </motion.button>

        {/* Theme toggle */}
        {mounted && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.5} />
              )}
            </motion.div>
          </motion.button>
        )}

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="relative p-2 sm:p-2.5 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant"
        >
          <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-tertiary rounded-full" />
        </motion.button>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 sm:ml-2 cursor-pointer outline-none">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
              <AvatarFallback className="bg-primary-container text-white text-xs sm:text-sm font-semibold">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-surface-container-lowest border-outline-variant/15 rounded-xl shadow-tonal-lg p-2"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-on-surface">
                {user?.name || "Andi Pratama"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {user?.email || "andi@email.com"}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-outline-variant/15" />
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              {t("settings.title")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg cursor-pointer text-tertiary"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
