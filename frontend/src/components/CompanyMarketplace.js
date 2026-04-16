import { useMemo, useState } from "react";
import { CROP_CATALOG } from "../constants/cropCatalog";
import CropCard from "./CropCard";
import DealInteractionPanel from "./DealInteractionPanel";
import MarketGraph from "./MarketGraph";
import OrderRequestModal from "./OrderRequestModal";
import PriceComparison from "./PriceComparison";

const labelMap = Object.fromEntries(CROP_CATALOG.map((crop) => [crop, crop]));

export default function CompanyMarketplace({
  availableCrops,
  companyDeals,
  onLockDeal,
  onStartInquiry,
  onSendMessage,
  onRateDeal,
  marketInsights,
  loading,
  activeView,
}) {
  const showDeals = activeView === "deals";
  const showMessages = activeView === "messages";
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [search, setSearch] = useState("");

  const filteredCrops = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return availableCrops;
    }

    return availableCrops.filter((crop) =>
      `${crop.type} ${crop.location} ${crop.grade} ${crop.farmer?.name || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [availableCrops, search]);

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="glass-surface rounded-[30px] p-6">
            <p className="inline-flex rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Company Dashboard
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900">
              {showMessages
                ? "Your Message Center"
                : showDeals
                  ? "Your Locked Deals"
                  : "Verified Farmer Marketplace"}
            </h2>
            <p className="mt-2 text-slate-600">
              {showMessages
                ? "Chat with farmers here. Use Marketplace to browse crops and My Deals to manage confirmed orders."
                : showDeals
                  ? "Review orders, transport decisions, ratings, and live communication in one place."
                  : "Search any crop, check live market listings, and place orders based on your exact quantity and delivery needs."}
            </p>
          </div>

          {showMessages ? (
            <div className="glass-surface rounded-[30px] p-6">
              <h3 className="text-2xl font-black text-slate-900">Open Conversations</h3>
              <div className="mt-5 space-y-4">
                {companyDeals.length ? (
                  companyDeals.map((deal) => (
                    <div
                      key={deal._id}
                      className="rounded-2xl border border-slate-200 bg-white/65 p-4 backdrop-blur-md"
                    >
                      <p className="font-semibold text-slate-900">
                        {labelMap[deal.crop?.type] || deal.crop?.type}
                      </p>
                      <p className="text-sm text-slate-600">
                        Farmer: {deal.farmer?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-slate-600">Status: {deal.status}</p>
                      <DealInteractionPanel
                        deal={deal}
                        currentRole="company"
                        onSendMessage={onSendMessage}
                        onRateDeal={onRateDeal}
                        loading={loading}
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                    No conversations yet. Use `Message Farmer` from a crop card to start chatting.
                  </div>
                )}
              </div>
            </div>
          ) : showDeals ? (
            <div className="glass-surface rounded-[30px] p-6">
              <h3 className="text-2xl font-black text-slate-900">Locked Deal History</h3>
              <div className="mt-5 space-y-4">
                {companyDeals.length ? (
                  companyDeals.map((deal) => (
                    <div
                      key={deal._id}
                      className="rounded-2xl border border-slate-200 bg-white/65 p-4 backdrop-blur-md"
                    >
                      <p className="font-semibold text-slate-900">
                        {labelMap[deal.crop?.type] || deal.crop?.type}
                      </p>
                      <p className="text-sm text-slate-600">
                        Farmer: {deal.farmer?.name || "Unknown"}
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
                      <DealInteractionPanel
                        deal={deal}
                        currentRole="company"
                        onSendMessage={onSendMessage}
                        onRateDeal={onRateDeal}
                        loading={loading}
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                    You have not locked any deals yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="glass-surface rounded-[26px] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-black text-slate-900">Search Marketplace</p>
                    <p className="text-sm text-slate-600">
                      Search by crop name, location, farmer, or grade.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                    Showing {filteredCrops.length} crop{filteredCrops.length === 1 ? "" : "s"}
                  </div>
                </div>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search crops, farmer, location, or grade"
                  className="glass-input mt-4 w-full rounded-2xl px-4 py-3"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredCrops.length ? (
                  filteredCrops.map((crop) => (
                    <CropCard
                      key={crop._id}
                      crop={crop}
                      onBuy={setSelectedCrop}
                      onMessage={onStartInquiry}
                      loading={loading}
                    />
                  ))
                ) : (
                  <div className="glass-surface rounded-[24px] p-6 text-sm text-slate-600 md:col-span-2">
                    Crop not found. Try another crop name or location.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          {!showMessages ? (
            <>
              <PriceComparison
                content={{
                  badge: "Price Comparison",
                  title: "Live market edge for direct sourcing",
                  middlemanRate: "Typical Chain Rate",
                  directProfit: "Direct Market Rate",
                  middlemanNote: "Extra commissions usually reduce farmer margin.",
                  directNote: "Direct sourcing improves transparency for both sides.",
                  middlemanValue: `Rs. ${marketInsights?.middlemanRate || 1800}`,
                  directValue: `Rs. ${marketInsights?.directRate || 2200}`,
                }}
              />
              <MarketGraph marketInsights={marketInsights} />
            </>
          ) : null}
          {showMessages ? null : (
            <div className="glass-surface rounded-[30px] p-6">
              <h3 className="text-2xl font-black text-slate-900">Quick Access</h3>
              <p className="mt-3 text-sm text-slate-600">
                Use `Marketplace` for crop discovery, `My Deals` for order management, and `Messages` for direct chat only.
              </p>
              <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900">
                Total locked deals: {companyDeals.length}
              </div>
            </div>
          )}
        </div>
      </div>

      <OrderRequestModal
        crop={selectedCrop}
        isOpen={Boolean(selectedCrop)}
        loading={loading}
        onClose={() => setSelectedCrop(null)}
        onSubmit={async (form) => {
          const success = await onLockDeal(selectedCrop, form);
          if (success) {
            setSelectedCrop(null);
          }
        }}
      />
    </>
  );
}
