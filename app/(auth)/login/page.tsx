"use client";

import { motion } from "framer-motion";
import { Landmark, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useLogin } from "@/lib/hooks";
import { isApiError } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await loginMutation.mutateAsync({ email, password });
      // User will be set by AuthProvider after token is stored
      router.push("/dashboard");
    } catch (err) {
      if (isApiError(err)) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left side — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-primary/80">
        {/* Abstract shapes */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5"
          />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-3xl bg-white/10 backdrop-blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-heading text-5xl font-bold mb-6 leading-tight">
              Your Financial
              <br />
              Command Center
            </h2>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Track your wealth, manage budgets, and gain insights into
              your financial health — all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center gap-8"
          >
            <div className="text-center">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-white/60">Active Users</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-sm text-white/60">Uptime</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">256-bit</p>
              <p className="text-sm text-white/60">Encryption</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface">
                MyMoney
              </h1>
              <p className="text-xs text-on-surface-variant">
                Indigo Vault Secure Access
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                <p className="text-sm text-error">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-label-sm text-on-surface-variant">
                {t("auth.email")}
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Mail className="w-4.5 h-4.5 text-on-surface-variant" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andi@email.com"
                  required
                  className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-label-sm text-on-surface-variant">
                  {t("auth.password")}
                </label>
                <button
                  type="button"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Lock className="w-4.5 h-4.5 text-on-surface-variant" strokeWidth={1.5} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loginMutation.isPending}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 btn-gradient text-center disabled:opacity-60"
            >
              {loginMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                />
              ) : (
                t("auth.signInVault")
              )}
            </motion.button>

            {/* Social login divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-4 text-on-surface-variant">
                  {t("auth.socialConnect")}
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="flex gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-sm font-medium text-on-surface flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-sm font-medium text-on-surface flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </motion.button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              {t("auth.noAccount")}{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline"
              >
                {t("auth.openVault")}
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-on-surface-variant">
            <span className="hover:text-on-surface cursor-pointer">{t("auth.privacyPolicy")}</span>
            <span className="hover:text-on-surface cursor-pointer">{t("auth.securityStandards")}</span>
            <span className="hover:text-on-surface cursor-pointer">{t("auth.help")}</span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>{t("auth.bankGradeEncryption")}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
