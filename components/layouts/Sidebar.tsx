"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  FileBarChart,
  Landmark,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "transactions", href: "/transactions", icon: ArrowLeftRight },
  { key: "assets", href: "/assets", icon: PieChart },
  { key: "budget", href: "/budget", icon: Wallet },
  { key: "reports", href: "/reports", icon: FileBarChart },
  { key: "accounts", href: "/accounts", icon: Landmark },
  { key: "settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { collapsed, mobileOpen, toggleCollapse, setMobileOpen } =
    useSidebarStore();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 lg:h-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="font-heading text-xl font-bold text-on-surface">
                  MyMoney
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.key} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative",
                  collapsed && "justify-center px-0 lg:px-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container rounded-xl"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 relative z-10 shrink-0",
                    isActive && "text-white"
                  )}
                  strokeWidth={1.5}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "text-sm font-medium relative z-10 whitespace-nowrap",
                        isActive && "text-white"
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={toggleCollapse}
        className="hidden lg:flex mx-3 mb-2 p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* User section */}
      <div
        className={cn(
          "px-4 py-4 border-t border-outline-variant/10",
          collapsed && "px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-primary-container text-white text-sm font-semibold">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-on-surface truncate">
                  {user?.name || "Andi Pratama"}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {user?.email || "andi@email.com"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col",
          "bg-surface-container-low/80 backdrop-blur-xl",
          "border-r border-outline-variant/10"
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar — slide-in overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed left-0 top-0 bottom-0 z-50 w-[280px] flex flex-col lg:hidden",
              "bg-surface-container-low backdrop-blur-xl",
              "border-r border-outline-variant/10"
            )}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
