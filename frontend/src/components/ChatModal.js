import DealInteractionPanel from "./DealInteractionPanel";

export default function ChatModal({
  isOpen,
  deal,
  currentRole,
  onClose,
  onSendMessage,
  onRateDeal,
  loading,
}) {
  if (!isOpen || !deal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="glass-surface w-full max-w-4xl rounded-[32px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Direct Chat
            </p>
            <h3 className="mt-4 text-3xl font-black text-slate-900">
              {deal.crop?.type || "Crop Discussion"}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {currentRole === "company"
                ? `Talk to ${deal.farmer?.name || "the farmer"} before or after placing an order.`
                : `Talk to ${deal.company?.name || "the company"} about quantity, delivery, and pricing.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition active:scale-95"
          >
            Close
          </button>
        </div>

        <DealInteractionPanel
          deal={deal}
          currentRole={currentRole}
          onSendMessage={onSendMessage}
          onRateDeal={onRateDeal}
          loading={loading}
        />
      </div>
    </div>
  );
}
