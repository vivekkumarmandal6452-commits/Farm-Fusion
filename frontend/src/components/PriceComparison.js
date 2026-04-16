export default function PriceComparison({ content }) {
  const copy = content || {
    badge: "Price Comparison",
    title: "More value without middlemen",
    middlemanRate: "Middleman Rate",
    directProfit: "Your Direct Profit",
    middlemanNote: "Traditional chain pricing with extra cuts.",
    directNote: "Direct factory selling keeps more value with the farmer.",
    middlemanValue: "Rs. 1800",
    directValue: "Rs. 2200",
  };

  return (
    <div className="price-comparison-card rounded-[28px] p-6 text-white">
      <p className="inline-flex rounded-full bg-white/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
        {copy.badge}
      </p>
      <h3 className="mt-4 max-w-lg text-2xl font-black text-white">
        {copy.title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50">
        Direct trade helps farmers keep a larger share of the selling price while companies still get verified sourcing.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="price-comparison-tile rounded-3xl p-5">
          <p className="text-sm font-semibold text-white/80">{copy.middlemanRate}</p>
          <p className="mt-2 text-4xl font-black text-white">{copy.middlemanValue}</p>
          <p className="mt-2 text-sm text-white/70">{copy.middlemanNote}</p>
        </div>
        <div className="price-comparison-tile price-comparison-tile-highlight rounded-3xl p-5 text-white">
          <p className="text-sm font-semibold text-emerald-100">{copy.directProfit}</p>
          <p className="mt-2 text-4xl font-black">{copy.directValue}</p>
          <p className="mt-2 text-sm text-emerald-50">{copy.directNote}</p>
        </div>
      </div>
    </div>
  );
}
