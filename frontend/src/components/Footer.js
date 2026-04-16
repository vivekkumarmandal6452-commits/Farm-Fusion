import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-emerald-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-black text-[#1B5E20]">
            Zero Middleman Agri Marketplace
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A direct farm-to-factory platform where farmers keep stronger margins and companies access verified crop supply.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Quick Links
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/" className="hover:text-[#1B5E20]">
              Home
            </Link>
            <Link to="/transport" className="hover:text-[#1B5E20]">
              Transport Hub
            </Link>
            <Link to="/login" className="hover:text-[#1B5E20]">
              Login
            </Link>
            <Link to="/register" className="hover:text-[#1B5E20]">
              Register
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Platform Value
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>No middleman, more profit for farmers.</p>
            <p>Verified listings for companies.</p>
            <p>Two transport models with worker employment support.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-4 text-center text-sm text-slate-500">
        Copyright 2026 Zero Middleman Agri Marketplace. Built for hackathon demo.
      </div>
    </footer>
  );
}
