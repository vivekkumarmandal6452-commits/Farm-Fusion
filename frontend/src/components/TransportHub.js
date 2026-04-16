const transportOptions = [
  {
    title: "Company Self Pickup",
    fee: "1% platform fee",
    summary:
      "The company collects the crop directly from the farmer. The platform manages discovery, verification, and secure deal coordination.",
    points: [
      "Lower logistics cost for companies",
      "Fast deal execution for nearby sourcing",
      "Best for factories with their own fleet",
    ],
  },
  {
    title: "Platform Delivery",
    fee: "3% platform fee",
    summary:
      "The platform arranges transport and worker support, so crops move from the farm to the factory with managed logistics.",
    points: [
      "2% goes to worker support and field operations",
      "Creates rural employment opportunities",
      "Useful for buyers who need managed pickup and delivery",
    ],
  },
];

export default function TransportHub() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-surface rounded-[32px] p-8">
          <p className="inline-flex rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Logistics Model
          </p>
          <h1 className="mt-5 text-4xl font-black text-slate-900">
            Transport choices built for direct farm-to-factory trade
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            The marketplace now supports two delivery models. Companies can either collect crops
            on their own or let the platform manage transport. This keeps deals transparent while
            also creating worker opportunities in rural logistics.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                Company Pickup
              </p>
              <p className="mt-3 text-3xl font-black text-slate-900">1%</p>
              <p className="mt-2 text-sm text-slate-600">Platform coordination fee</p>
            </div>
            <div className="rounded-[24px] bg-amber-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                Platform Delivery
              </p>
              <p className="mt-3 text-3xl font-black text-slate-900">3%</p>
              <p className="mt-2 text-sm text-slate-600">Managed transport and logistics fee</p>
            </div>
            <div className="rounded-[24px] bg-slate-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                Worker Share
              </p>
              <p className="mt-3 text-3xl font-black text-slate-900">2%</p>
              <p className="mt-2 text-sm text-slate-600">Allocated to worker support on delivery jobs</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {transportOptions.map((option) => (
            <article key={option.title} className="glass-surface rounded-[28px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-black text-slate-900">{option.title}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#1B5E20]">
                    {option.fee}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{option.summary}</p>
              <div className="mt-5 space-y-2 text-sm text-slate-700">
                {option.points.map((point) => (
                  <p key={point}>• {point}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
