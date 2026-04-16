import { useState } from "react";
import { CROP_CATALOG } from "../constants/cropCatalog";
import DealInteractionPanel from "./DealInteractionPanel";
import MarketGraph from "./MarketGraph";
import PriceComparison from "./PriceComparison";

const cropOptions = CROP_CATALOG.map((crop) => ({
  label: crop,
  value: crop,
}));

const labelMap = Object.fromEntries(CROP_CATALOG.map((crop) => [crop, crop]));

const initialForm = {
  type: "Wheat",
  quantity: "",
  moisture: "",
  price: "",
};

export default function FarmerDashboard({
  user,
  myCrops,
  farmerDeals,
  onAddCrop,
  onSendMessage,
  marketInsights,
  loading,
  activeView,
}) {
  const [form, setForm] = useState(initialForm);
  const showRequestsOnly = activeView === "interest";
  const showMessagesOnly = activeView === "messages";
  const isMessagesView = showMessagesOnly;
  const isRequestsView = showRequestsOnly;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onAddCrop(form);
    if (success) {
      setForm(initialForm);
    }
  };

  return (
    <div
      className={`mx-auto max-w-7xl gap-6 px-4 py-8 ${
        showRequestsOnly || showMessagesOnly ? "grid" : "grid lg:grid-cols-[1.1fr_0.9fr]"
      }`}
    >
      {!showRequestsOnly && !showMessagesOnly ? (
        <div className="space-y-6">
          <div className="glass-surface rounded-[30px] p-6">
            <p className="inline-flex rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Farmer Dashboard
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900">
              List crops directly and keep more value
            </h2>
            <p className="mt-2 text-slate-600">
              Welcome back, {user.name}. Your crop listing can now receive partial orders, delivery notes, and direct buyer communication.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="glass-input rounded-2xl px-4 py-3"
              >
                {cropOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                name="quantity"
                type="number"
                placeholder="Quantity (tons)"
                value={form.quantity}
                onChange={handleChange}
                className="glass-input rounded-2xl px-4 py-3"
                required
              />
              <input
                name="moisture"
                type="number"
                placeholder="Moisture %"
                value={form.moisture}
                onChange={handleChange}
                className="glass-input rounded-2xl px-4 py-3"
                required
              />
              <input
                name="price"
                type="number"
                placeholder="Price per ton"
                value={form.price}
                onChange={handleChange}
                className="glass-input rounded-2xl px-4 py-3"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 rounded-full bg-[#1B5E20] px-5 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(27,94,32,0.24)] active:scale-95 disabled:opacity-60"
              >
                {loading ? "Posting..." : "Sell Direct"}
              </button>
            </form>
          </div>

          <div className="glass-surface rounded-[30px] p-6">
            <h3 className="text-2xl font-black text-slate-900">My Listings</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {myCrops.length ? (
                myCrops.map((crop) => (
                  <div
                    key={crop._id}
                    className="rounded-[24px] border border-emerald-100 bg-white/55 p-5 backdrop-blur-md"
                  >
                    <p className="text-xl font-black text-slate-900">
                      {labelMap[crop.type] || crop.type}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">Total Quantity: {crop.quantity} tons</p>
                    <p className="text-sm text-slate-600">
                      Available Quantity: {crop.availableQuantity ?? crop.quantity} tons
                    </p>
                    <p className="text-sm text-slate-600">Moisture: {crop.moisture}%</p>
                    <p className="text-sm text-slate-600">Grade: {crop.grade}</p>
                    {(crop.availableQuantity ?? crop.quantity) <= 0 ? (
                      <p className="mt-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-red-700">
                        Crop Not Found For Buyers
                      </p>
                    ) : null}
                    <p className="mt-3 font-bold text-[#1B5E20]">Rs. {crop.price} / ton</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] bg-slate-100/75 p-5 text-sm text-slate-600 md:col-span-2">
                  No crop listings yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-6">
        {!showRequestsOnly && !showMessagesOnly ? (
          <>
            <PriceComparison
              content={{
                badge: "Price Comparison",
                title: "More value without middlemen",
                middlemanRate: "Middleman Rate",
                directProfit: "Your Direct Profit",
                middlemanNote: "Traditional chain pricing with extra cuts.",
                directNote: "Direct farmer selling keeps more value with you.",
                middlemanValue: `Rs. ${marketInsights?.middlemanRate || 1800}`,
                directValue: `Rs. ${marketInsights?.directRate || 2200}`,
              }}
            />
            <MarketGraph marketInsights={marketInsights} />
          </>
        ) : null}
        {isRequestsView ? (
          <div className="glass-surface rounded-[30px] p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Buyer Requests
                </p>
                <h3 className="mt-4 text-2xl font-black text-slate-900">Company Interest</h3>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-[#1B5E20]">
                {farmerDeals.length} request{farmerDeals.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {farmerDeals.length ? (
                farmerDeals.map((deal) => (
                  <div
                    key={deal._id}
                    className="rounded-2xl border border-slate-200 bg-white/65 p-4 backdrop-blur-md"
                  >
                    <p className="font-semibold text-slate-900">
                      {labelMap[deal.crop?.type] || deal.crop?.type}
                    </p>
                    <p className="text-sm text-slate-600">
                      Company: {deal.company?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-slate-600">Status: {deal.status}</p>
                    <p className="text-sm text-slate-600">
                      Transport:{" "}
                      {deal.transportMode === "platform_delivery"
                        ? "Platform Delivery"
                        : "Company Self Pickup"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Transaction: {deal.transactionId}
                    </p>
                    <div className="mt-4 rounded-2xl bg-amber-50/80 p-4 text-sm text-amber-900">
                      Open the <span className="font-bold">Messages</span> tab to chat with this company.
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-100/75 p-4 text-sm text-slate-600">
                  No company has locked a crop yet. Requests will appear here automatically.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {isMessagesView ? (
          <div className="glass-surface rounded-[30px] p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Messages
                </p>
                <h3 className="mt-4 text-2xl font-black text-slate-900">Farmer Conversations</h3>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                {farmerDeals.length} active chat{farmerDeals.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {farmerDeals.length ? (
                farmerDeals.map((deal) => (
                  <div
                    key={deal._id}
                    className="rounded-2xl border border-slate-200 bg-white/65 p-4 backdrop-blur-md"
                  >
                    <p className="font-semibold text-slate-900">
                      {labelMap[deal.crop?.type] || deal.crop?.type}
                    </p>
                    <p className="text-sm text-slate-600">
                      Company: {deal.company?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-slate-600">Status: {deal.status}</p>
                    <DealInteractionPanel
                      deal={deal}
                      currentRole="farmer"
                      onSendMessage={onSendMessage}
                      onRateDeal={async () => false}
                      loading={loading}
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-100/75 p-4 text-sm text-slate-600">
                  No conversations yet. When a company messages you, chats will appear here.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {!isRequestsView && !isMessagesView ? (
          <div className="glass-surface rounded-[30px] p-6">
            <h3 className="text-2xl font-black text-slate-900">Buyer Requests</h3>
            <p className="mt-3 text-sm text-slate-600">
              Open `Buyer Requests` from the navbar to review demand details, and use `Messages` for direct chat only.
            </p>
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
              You currently have {farmerDeals.length} company request{farmerDeals.length === 1 ? "" : "s"}.
            </div>
          </div>
        ) : (
          null
        )}
      </div>
    </div>
  );
}
