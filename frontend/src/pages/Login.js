import { useState } from "react";

export default function Login({ onSubmit, onForgotPassword, loading }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "farmer",
  });
  const [resetForm, setResetForm] = useState({
    email: "",
    role: "farmer",
    newPassword: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleResetChange = (event) => {
    const { name, value } = event.target;
    setResetForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError("");
    onSubmit(form);
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setLocalError("New password and confirm password must match.");
      return;
    }

    setLocalError("");
    const success = await onForgotPassword?.({
      email: resetForm.email,
      role: resetForm.role,
      newPassword: resetForm.newPassword,
    });

    if (success) {
      setMode("login");
      setResetForm({
        email: "",
        role: "farmer",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="auth-page-shell mx-auto grid max-w-7xl gap-6 rounded-[36px] px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="auth-showcase auth-showcase-login rounded-[34px] p-8 text-white shadow-[0_24px_70px_rgba(16,24,40,0.16)]">
        <div className="max-w-lg rounded-[28px] bg-[#173620]/62 p-6 backdrop-blur-sm auth-fade-in">
          <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
            Authentication
          </p>
          <h1 className="mt-5 text-4xl font-black">
            {mode === "login" ? "Welcome Back!" : "Reset Your Password"}
          </h1>
          <p className="mt-3 max-w-lg text-emerald-50">
            {mode === "login"
              ? "Sign in as a farmer or company to access your dashboard and start direct trade."
              : "Use your registered email and role, then set a new password to get back into your account."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="auth-glass-card auth-float">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Farmer Value</p>
            <p className="mt-2 text-3xl font-black">Fair Rate</p>
            <p className="mt-2 text-sm text-emerald-50">Direct factory access with stronger margins.</p>
          </div>
          <div className="auth-glass-card auth-float-delayed">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Company Value</p>
            <p className="mt-2 text-3xl font-black">Verified Supply</p>
            <p className="mt-2 text-sm text-emerald-50">Direct farmer listings with grade and location.</p>
          </div>
        </div>
      </div>

      {mode === "login" ? (
        <form
          onSubmit={handleSubmit}
          className="auth-form-card auth-form-animate rounded-[34px] bg-white p-8 shadow-[0_24px_70px_rgba(16,24,40,0.12)]"
        >
          <p className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1B5E20]">
            Secure Login
          </p>
          <h2 className="mt-5 text-3xl font-black text-slate-900">Login</h2>
          <p className="mt-2 text-sm text-slate-500">Choose your role and access your account securely.</p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-2 auth-fade-in">
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, role: "farmer" }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  form.role === "farmer"
                    ? "bg-[#1B5E20] text-white"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, role: "company" }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  form.role === "company"
                    ? "bg-[#FFAB00] text-slate-900"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                Company
              </button>
            </div>
            <div className="auth-input-wrap auth-fade-in">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
                required
              />
            </div>
            <div className="auth-input-wrap auth-fade-in">
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setLocalError("");
                  setResetForm((current) => ({
                    ...current,
                    email: form.email,
                    role: form.role,
                  }));
                  setMode("forgot");
                }}
                className="text-sm font-semibold text-[#1B5E20] transition hover:text-[#14461a]"
              >
                Forgot Password?
              </button>
            </div>
            {localError ? <p className="text-sm font-medium text-red-600">{localError}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#1B5E20] px-5 py-3 font-semibold text-white transition duration-200 hover:scale-[1.01] hover:shadow-[0_16px_28px_rgba(27,94,32,0.28)] active:scale-95 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleResetSubmit}
          className="auth-form-card auth-form-animate rounded-[34px] bg-white p-8 shadow-[0_24px_70px_rgba(16,24,40,0.12)]"
        >
          <p className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9a6400]">
            Password Reset
          </p>
          <h2 className="mt-5 text-3xl font-black text-slate-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your registered email and set a new password.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-2 auth-fade-in">
              <button
                type="button"
                onClick={() => setResetForm((current) => ({ ...current, role: "farmer" }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  resetForm.role === "farmer"
                    ? "bg-[#1B5E20] text-white"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => setResetForm((current) => ({ ...current, role: "company" }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  resetForm.role === "company"
                    ? "bg-[#FFAB00] text-slate-900"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                Company
              </button>
            </div>
            <div className="auth-input-wrap auth-fade-in">
              <input
                name="email"
                type="email"
                value={resetForm.email}
                onChange={handleResetChange}
                placeholder="Registered Email"
                className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
                required
              />
            </div>
            <div className="auth-input-wrap auth-fade-in">
              <input
                name="newPassword"
                type="password"
                value={resetForm.newPassword}
                onChange={handleResetChange}
                placeholder="New Password"
                className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
                required
              />
            </div>
            <div className="auth-input-wrap auth-fade-in">
              <input
                name="confirmPassword"
                type="password"
                value={resetForm.confirmPassword}
                onChange={handleResetChange}
                placeholder="Confirm New Password"
                className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
                required
              />
            </div>
            {localError ? <p className="text-sm font-medium text-red-600">{localError}</p> : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setLocalError("");
                  setMode("login");
                }}
                className="rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#1B5E20] px-5 py-3 font-semibold text-white transition duration-200 hover:scale-[1.01] hover:shadow-[0_16px_28px_rgba(27,94,32,0.28)] active:scale-95 disabled:opacity-60"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
