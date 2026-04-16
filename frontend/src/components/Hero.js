const fallbackPrices = [
  { name: "Wheat (Gehu)", price: 2200 },
  { name: "Paddy (Dhan)", price: 2050 },
  { name: "Maize (Makka)", price: 1850 },
];

export default function Hero({
  user,
  crops,
  onPrimaryAction,
  onSecondaryAction,
  showActions = true,
}) {
  const marketPrices = crops.length
    ? crops.slice(0, 3).map((crop) => ({
        name: `${crop.type}${crop.location ? ` (${crop.location})` : ""}`,
        price: crop.price,
      }))
    : fallbackPrices;

  return (
    <section className="mx-auto mt-6 grid max-w-7xl gap-6 px-4 lg:grid-cols-[1.6fr_0.9fr]">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(16,24,40,0.12)]">
        <div className="grid min-h-[420px] gap-6 bg-[linear-gradient(135deg,rgba(18,97,56,0.92),rgba(42,157,80,0.6)),url('https://images.unsplash.com/photo-1500382017468-9049fed747ef')] bg-cover bg-center p-8 text-white md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]">
              No-Middleman. 100% Direct.
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight md:text-5xl">
              Zero Middleman Agri Marketplace
            </h1>
            <p className="mt-4 max-w-lg text-base text-emerald-50 md:text-lg">
              Connect directly with factories, get fair prices, and lock deals faster.
              Farmer aur company dono ke liye ek working digital marketplace.
            </p>
            {showActions ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={onPrimaryAction}
                  className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
                >
                  {user?.role === "farmer"
                    ? "Open Farmer Dashboard"
                    : user?.role === "company"
                      ? "Open Company Marketplace"
                      : "I'm a Farmer"}
                </button>
                <button
                  onClick={onSecondaryAction}
                  className="rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
                >
                  {user ? "Marketplace" : "I'm a Company"}
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-5">
            <div className="ml-auto w-full max-w-sm rounded-3xl bg-white/92 p-5 text-slate-900 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Today's Market Price
              </p>
              <div className="mt-4 space-y-3">
                {marketPrices.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-bold text-emerald-700">Rs. {item.price}/ton</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl bg-white p-5 text-slate-900 shadow-xl md:grid-cols-4">
              <div>
                <p className="text-3xl font-black text-emerald-700">
                  {crops.length || "5,000+"}
                </p>
                <p className="text-sm text-slate-500">Marketplace Listings</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-700">
                  {user ? "1" : "200+"}
                </p>
                <p className="text-sm text-slate-500">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-700">
                  {crops.length ? `Rs. ${Math.max(...crops.map((crop) => crop.price))}` : "Rs. 2200"}
                </p>
                <p className="text-sm text-slate-500">Top Market Value</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-700">0%</p>
                <p className="text-sm text-slate-500">Commission</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
          <p className="text-xl font-black text-emerald-900">AgriDirect</p>
          <p className="mt-1 text-sm text-slate-500">
            {user ? "You are signed in and ready to work." : "Choose your role and start instantly."}
          </p>
          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              Farmer
            </span>
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              Company
            </span>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <p>1. Farmer crop list karega to company marketplace me turant dikh jayega.</p>
            <p>2. Company direct deal lock karegi to history me aa jayega.</p>
            <p>3. Market trend graph listed crop prices se auto update hota rahega.</p>
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(16,24,40,0.18)]">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
            Tech Stack
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/10 px-4 py-3">Node.js</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">Express</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">MongoDB</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">React</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">Tailwind</div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">Recharts</div>
          </div>
        </div>
      </div>
    </section>
  );
}
