import { useState } from "react";

export default function Register({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    location: "",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <div className="auth-page-shell mx-auto grid max-w-7xl gap-6 rounded-[36px] px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="auth-showcase auth-showcase-register rounded-[34px] p-8 text-white shadow-[0_24px_70px_rgba(16,24,40,0.16)]">
        <div className="max-w-lg rounded-[28px] bg-[#4a3418]/55 p-6 backdrop-blur-sm auth-fade-in">
          <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
            Register
          </p>
          <h1 className="mt-5 text-4xl font-black">Create Your Account</h1>
          <p className="mt-3 max-w-lg text-amber-50">
            Join the marketplace as a farmer or company and start trading without intermediaries.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="auth-glass-card auth-float">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Farmer</p>
            <p className="mt-2 text-3xl font-black">List Crop Fast</p>
            <p className="mt-2 text-sm text-amber-50">List wheat, paddy, and maize directly for buyers.</p>
          </div>
          <div className="auth-glass-card auth-float-delayed">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Company</p>
            <p className="mt-2 text-3xl font-black">Buy Direct</p>
            <p className="mt-2 text-sm text-amber-50">Source verified crop listings with faster logistics choices.</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="auth-form-card auth-form-animate rounded-[34px] bg-white p-8 shadow-[0_24px_70px_rgba(16,24,40,0.12)]"
      >
        <p className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9a6400]">
          Join Platform
        </p>
        <h2 className="mt-5 text-3xl font-black text-slate-900">Register</h2>
        <p className="mt-2 text-sm text-slate-500">Create a professional account for your marketplace role.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex gap-2 auth-fade-in">
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
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
              required
            />
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
          <div className="auth-input-wrap auth-fade-in">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
              required
            />
          </div>
          <div className="auth-input-wrap auth-fade-in md:col-span-2">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile number (optional)"
              className="auth-input-glass px-4 py-3 text-slate-800 transition focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 rounded-full bg-[#1B5E20] px-5 py-3 font-semibold text-white transition duration-200 hover:scale-[1.01] hover:shadow-[0_16px_28px_rgba(27,94,32,0.28)] active:scale-95 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
