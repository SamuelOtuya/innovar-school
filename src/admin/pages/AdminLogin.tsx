
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../../services/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) return;

        const { data: isAdmin, error: roleError } =
          await supabase.rpc("is_innovar_admin");

        if (!active) return;

        if (!roleError && isAdmin === true) {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Admin session check failed:", error);
      } finally {
        if (active) setChecking(false);
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (signingIn) return;

    setSigningIn(true);
    setErrorMessage("");

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setErrorMessage("Invalid email or password.");
        return;
      }

      const { data: isAdmin, error: roleError } =
        await supabase.rpc("is_innovar_admin");

      if (roleError || isAdmin !== true) {
        await supabase.auth.signOut();

        setErrorMessage(
          "This account is not authorized to access Innovar administration."
        );

        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      setErrorMessage(
        "Unable to sign in. Please try again."
      );
    } finally {
      setSigningIn(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101A44] text-white">
        Checking administrator access...
      </div>
    );
  }

  if (authorized) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#101A44] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F5BE20] text-[#101A44] shadow-xl">
            <GraduationCap size={42} />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            INNOVAR
          </h1>

          <p className="mt-2 text-sm font-medium text-[#F5BE20]">
            Administration Portal
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#101A44]">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage Innovar International
              School and Innovar Institute.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#542080] focus:ring-2 focus:ring-[#542080]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-bold text-[#101A44]"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 text-sm outline-none focus:border-[#542080] focus:ring-2 focus:ring-[#542080]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#542080]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={signingIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#542080] py-4 text-sm font-bold text-white transition-colors hover:bg-[#3C1461] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingIn ? "Signing In..." : "Sign In"}
              {!signingIn && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-[#542080]" />
            Authorized Innovar personnel only
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-white/60">
          Innovar International School & Innovar Institute
        </p>
      </div>
    </section>
  );
}
