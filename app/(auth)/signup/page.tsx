"use client";

import { motion } from "framer-motion";
import { Landmark, Mail, Lock, Eye, EyeOff, User, ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useRegister } from "@/lib/hooks";
import { isApiError } from "@/lib/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("Please agree to the terms and conditions");
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, email, password });
      // User will be set by AuthProvider after token is stored
      router.push("/dashboard");
    } catch (err) {
      if (isApiError(err)) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left side — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-container via-primary to-primary/90">
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-[3rem] bg-white/10 backdrop-blur-sm rotate-12"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-heading text-5xl font-bold mb-6 leading-tight">
              Start Building
              <br />
              Your Wealth
            </h2>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Join thousands of users who trust MyMoney to manage their
              finances with ease and security.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 space-y-4"
          >
            {["Track all your assets in one place", "Smart budget management", "Detailed financial reports"].map(
              (feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-white/80">{feature}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </div>

      {/* Right side — signup form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface">MyMoney</h1>
              <p className="text-xs text-on-surface-variant">Create Your Vault</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Name */}
            <div className="space-y-2">
              <label className="text-label-sm text-on-surface-variant">{t("auth.fullName")}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <User className="w-4.5 h-4.5 text-on-surface-variant" strokeWidth={1.5} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Andi Pratama"
                  required
                  className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-label-sm text-on-surface-variant">{t("auth.email")}</label>
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
              <label className="text-label-sm text-on-surface-variant">{t("auth.password")}</label>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-label-sm text-on-surface-variant">{t("auth.confirmPassword")}</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low focus-within:bg-surface-container-highest focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Lock className="w-4.5 h-4.5 text-on-surface-variant" strokeWidth={1.5} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-primary"
              />
              <span className="text-xs text-on-surface-variant leading-relaxed">
                {t("auth.agreeTerms")}
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={registerMutation.isPending || !agreed}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 btn-gradient text-center disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                />
              ) : (
                t("auth.openVault")
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                {t("auth.signInHere")}
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>{t("auth.bankGradeEncryption")}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
