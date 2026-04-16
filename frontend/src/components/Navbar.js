import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout, language, onLanguageChange, labels }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = labels || {
    home: "Home",
    transportHub: "Transport Hub",
    login: "Login",
    register: "Register",
    farmerDashboard: "Farmer Dashboard",
    buyerRequests: "Buyer Requests",
    messages: "Messages",
    marketplace: "Marketplace",
    myDeals: "My Deals",
    logout: "Logout",
    
    brandTitle: "Zero Middleman Agri Marketplace",
    brandSubtitle: "Direct Farmer-to-Factory | Transparent Trade",
    english: "English",
    hindi: "Hindi",
  };

  const guestLinks = [
    { to: "/", label: copy.home },
    { to: "/transport", label: copy.transportHub },
    { to: "/login", label: copy.login },
    { to: "/register", label: copy.register },
  ];

  const userLinks =
    user?.role === "farmer"
      ? [
          { to: "/", label: copy.home },
          { to: "/transport", label: copy.transportHub },
          { to: "/farmer", label: copy.farmerDashboard },
          { to: "/farmer/requests", label: copy.buyerRequests },
          { to: "/farmer/messages", label: copy.messages },
        ]
      : [
          { to: "/", label: copy.home },
          { to: "/transport", label: copy.transportHub },
          { to: "/company", label: copy.marketplace },
          { to: "/company/deals", label: copy.myDeals },
          { to: "/company/messages", label: copy.messages },
        ];

  const links = user ? userLinks : guestLinks;
  const profilePath = user ? `/${user.role}/profile` : "/";
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "AG";

  return (
    <header className="navbar-shell sticky top-0 z-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 whitespace-nowrap">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B5E20] text-white shadow-lg">
              <span className="text-xl">F2F</span>
            </div>
            <div>
              <p className="text-xl font-black leading-tight tracking-tight text-white">
                Zero Middleman
              </p>
              <p className="text-xl font-black leading-tight tracking-tight text-white">
                Agri Marketplace
              </p>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="navbar-mobile-toggle flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/14 text-white shadow-sm backdrop-blur-md lg:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-white transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-white transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-white transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        <div className="navbar-desktop flex flex-nowrap items-center gap-2 overflow-x-auto lg:justify-end">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `navbar-pill shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-[#134e1f]"
                    : "bg-white/88 text-[#16351d] hover:bg-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="flex shrink-0 items-center rounded-full border border-white/20 bg-white/12 p-1 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={() => onLanguageChange?.("en")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                language === "en"
                  ? "bg-white text-[#134e1f]"
                  : "bg-white/86 text-[#16351d] hover:bg-white"
              }`}
            >
              {copy.english}
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange?.("hi")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                language === "hi"
                  ? "bg-[#FFAB00] text-slate-900"
                  : "bg-white/86 text-[#16351d] hover:bg-white"
              }`}
            >
              {copy.hindi}
            </button>
          </div>

          {user ? (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to={profilePath}
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center rounded-[22px] border border-white/18 bg-white/12 px-2.5 py-2 text-center shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1B5E20] to-[#FFAB00] text-xs font-black text-white shadow-md">
                  {initials}
                </span>
                <span className="mt-1.5 max-w-[76px] truncate text-[11px] font-bold text-white">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="rounded-full bg-[#FFAB00] px-4 py-2 text-sm font-semibold text-slate-900 transition active:scale-95"
              >
                {copy.logout}
              </button>
            </div>
          ) : null}
        </div>

        <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""} lg:hidden`}>
          <div className="navbar-mobile-panel">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={`mobile-${link.to}`}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `navbar-mobile-link rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-[#134e1f]"
                        : "bg-white/88 text-[#16351d] hover:bg-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-3 flex items-center rounded-full border border-white/20 bg-white/18 p-1 shadow-sm backdrop-blur-md">
              <button
                type="button"
                onClick={() => onLanguageChange?.("en")}
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  language === "en"
                    ? "bg-white text-[#134e1f]"
                    : "bg-white/86 text-[#16351d] hover:bg-white"
                }`}
              >
                {copy.english}
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange?.("hi")}
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  language === "hi"
                    ? "bg-[#FFAB00] text-slate-900"
                    : "bg-white/86 text-[#16351d] hover:bg-white"
                }`}
              >
                {copy.hindi}
              </button>
            </div>

            {user ? (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-[24px] border border-white/18 bg-white/18 p-3 backdrop-blur-md">
                <Link
                  to={profilePath}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1B5E20] to-[#FFAB00] text-xs font-black text-white shadow-md">
                    {initials}
                  </span>
                  <span className="text-sm font-bold text-white">{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="rounded-full bg-[#FFAB00] px-4 py-2 text-sm font-semibold text-slate-900 transition active:scale-95"
                >
                  {copy.logout}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
