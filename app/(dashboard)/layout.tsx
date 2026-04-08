"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { Topbar } from "@/components/layouts/Topbar";
import { useAuthStore, mockUser } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { collapsed, mobileOpen } = useSidebarStore();

  useEffect(() => {
    if (!isAuthenticated) {
      login(mockUser);
    }
  }, [isAuthenticated, login]);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => useSidebarStore.getState().setMobileOpen(false)}
        />
      )}

      {/* Main content — responsive offset */}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${
          collapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
        } ml-0`}
      >
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
