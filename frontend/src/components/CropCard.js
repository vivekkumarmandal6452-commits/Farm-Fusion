export default function CropCard({ crop, onBuy, onMessage, loading }) {
  const labelMap = {
    Wheat: "Wheat",
    Paddy: "Paddy",
    Maize: "Maize",
  };

  return (
    <article className="glass-surface transform rounded-[26px] p-5 transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(16,24,40,0.16)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-black text-slate-900">
            {labelMap[crop.type] || crop.type}
          </p>
          <p className="mt-1 text-sm text-slate-500">{crop.location}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          {crop.grade}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>Total Quantity: {crop.quantity} tons</p>
        <p>Available Quantity: {crop.availableQuantity ?? crop.quantity} tons</p>
        <p>Price: Rs. {crop.price} / ton</p>
        <p>Farmer: {crop.farmer?.name || "Unknown Farmer"}</p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#FFAB00]/15 px-3 py-1 text-xs font-bold text-[#B77900]">
            No-Middleman Verified
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Moisture: {crop.moisture}%
          </span>
        </div>
        <div className="grid gap-2">
          <div className="rounded-2xl bg-slate-100/80 px-4 py-3 text-xs text-slate-700">
            Self pickup by company: 1% platform fee
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
            Platform delivery: 3% fee, including 2% worker support
          </div>
        </div>
        {onBuy ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => onBuy(crop)}
              disabled={loading}
              className="rounded-full bg-[#1B5E20] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(27,94,32,0.24)] active:scale-95 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Order Now"}
            </button>
            <button
              onClick={() => onMessage(crop)}
              disabled={loading}
              className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(15,23,42,0.24)] active:scale-95 disabled:opacity-60"
            >
              {loading ? "Opening..." : "Message Farmer"}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
