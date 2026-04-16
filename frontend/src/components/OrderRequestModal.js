import { useEffect, useState } from "react";

const initialForm = {
  requestedQuantity: "",
  deliveryLocation: "",
  deliveryInstructions: "",
  companyNotes: "",
  transportMode: "company_pickup",
};

export default function OrderRequestModal({ crop, isOpen, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (crop && isOpen) {
      setForm({
        requestedQuantity: crop.availableQuantity || crop.quantity || "",
        deliveryLocation: "",
        deliveryInstructions: "",
        companyNotes: "",
        transportMode: "company_pickup",
      });
    }
  }, [crop, isOpen]);

  if (!isOpen || !crop) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="glass-surface w-full max-w-2xl rounded-[30px] p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
              Create Order Request
            </p>
            <h3 className="mt-4 text-3xl font-black text-slate-900">{crop.type}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Available quantity: {crop.availableQuantity ?? crop.quantity} tons
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition active:scale-95"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            name="requestedQuantity"
            type="number"
            min="0.01"
            step="0.01"
            value={form.requestedQuantity}
            onChange={handleChange}
            placeholder="Required quantity (tons)"
            className="glass-input rounded-2xl px-4 py-3"
            required
          />
          <input
            name="deliveryLocation"
            value={form.deliveryLocation}
            onChange={handleChange}
            placeholder="Delivery location"
            className="glass-input rounded-2xl px-4 py-3"
            required
          />
          <textarea
            name="deliveryInstructions"
            value={form.deliveryInstructions}
            onChange={handleChange}
            placeholder="Delivery instructions"
            rows={4}
            className="glass-input rounded-2xl px-4 py-3 md:col-span-2"
          />
          <textarea
            name="companyNotes"
            value={form.companyNotes}
            onChange={handleChange}
            placeholder="Order notes for the farmer"
            rows={4}
            className="glass-input rounded-2xl px-4 py-3 md:col-span-2"
          />
          <div className="rounded-[24px] bg-slate-100/85 p-4 md:col-span-2">
            <p className="text-sm font-bold text-slate-800">Transport Preference</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="rounded-[20px] border border-slate-200 bg-white/80 p-4">
                <input
                  type="radio"
                  name="transportMode"
                  value="company_pickup"
                  checked={form.transportMode === "company_pickup"}
                  onChange={handleChange}
                />
                <span className="ml-2 font-semibold text-slate-900">Company Self Pickup</span>
                <p className="mt-2 text-sm text-slate-600">1% platform fee</p>
              </label>
              <label className="rounded-[20px] border border-slate-200 bg-white/80 p-4">
                <input
                  type="radio"
                  name="transportMode"
                  value="platform_delivery"
                  checked={form.transportMode === "platform_delivery"}
                  onChange={handleChange}
                />
                <span className="ml-2 font-semibold text-slate-900">Platform Delivery</span>
                <p className="mt-2 text-sm text-slate-600">3% platform fee, includes 2% worker support</p>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-full bg-[#1B5E20] px-6 py-3 font-semibold text-white transition hover:scale-[1.01] active:scale-95 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Order Request"}
        </button>
      </form>
    </div>
  );
}
