import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import MarketGraph from "./MarketGraph";

const initialCropForm = {
  type: "Wheat (Gehu)",
  quantity: "",
  moisture: "",
  price: "",
  location: "",
};

const roleMenu = {
  farmer: ["Dashboard", "Add Crop", "My Crops", "My Deals", "Profile"],
  company: ["Dashboard", "Marketplace", "My Deals", "Transactions", "Profile"],
};

const cropTypes = ["All Grains", "Wheat (Gehu)", "Paddy (Dhan)", "Maize (Makka)", "Mustard"];
const gradeTypes = ["All Grades", "Premium", "A", "B", "C"];

export default function Dashboard({
  crops,
  deals,
  user,
  loading,
  onCreateCrop,
  onLockDeal,
  onDeleteCrop,
  onUpdateDealStatus,
  onViewChange,
  forcedPanel,
}) {
  const role = String(user?.role || "").toLowerCase();
  const [cropForm, setCropForm] = useState(initialCropForm);
  const [modalData, setModalData] = useState(null);
  const [activePanel, setActivePanel] = useState(role === "company" ? "Marketplace" : "Dashboard");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Grains");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");

  useEffect(() => {
    setActivePanel(role === "company" ? "Marketplace" : "Dashboard");
  }, [role]);

  useEffect(() => {
    if (forcedPanel) {
      setActivePanel(forcedPanel);
    }
  }, [forcedPanel]);

  const ownCrops = useMemo(() => {
    if (!user) return [];
    return crops.filter((crop) => crop.farmer?._id === user._id);
  }, [crops, user]);

  const incomingMarketplaceCrops = useMemo(() => {
    if (!user) return crops;
    if (role === "farmer") return crops;
    return crops.filter((crop) => crop.farmer?._id !== user._id);
  }, [crops, role, user]);

  const marketplaceCrops = useMemo(() => {
    return incomingMarketplaceCrops.filter((crop) => {
      const matchesSearch =
        !search ||
        `${crop.type} ${crop.location} ${crop.farmer?.name || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesType = selectedType === "All Grains" || crop.type === selectedType;
      const matchesGrade = selectedGrade === "All Grades" || crop.grade === selectedGrade;
      return matchesSearch && matchesType && matchesGrade;
    });
  }, [incomingMarketplaceCrops, search, selectedType, selectedGrade]);

  const qualityScore = useMemo(() => {
    const moisture = Number(cropForm.moisture);
    if (!Number.isFinite(moisture)) return "Pending";
    if (moisture < 12) return "Premium";
    if (moisture < 14) return "A";
    if (moisture < 16) return "B";
    return "C";
  }, [cropForm.moisture]);

  const completedDeals = deals.filter((deal) => deal.status === "completed");
  const lockedDeals = deals.filter((deal) => deal.status === "locked");

  const handleCropChange = (event) => {
    const { name, value } = event.target;
    setCropForm((current) => ({ ...current, [name]: value }));
  };

  const handleCropSubmit = async (event) => {
    event.preventDefault();
    const created = await onCreateCrop(cropForm);
    if (created) {
      setCropForm(initialCropForm);
      setActivePanel("My Crops");
    }
  };

  const handleLock = async (crop) => {
    const locked = await onLockDeal(crop);
    if (locked) {
      setModalData({
        title: "Deal Locked Successfully!",
        message: `${crop.type} | ${crop.quantity} tons | Rs. ${crop.price}/ton`,
      });
      setActivePanel("My Deals");
    }
  };

  const renderOverview = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {role === "farmer" ? (
        <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Farmer Dashboard - List Crop
              </p>
              <h3 className="mt-4 text-2xl font-black text-slate-900">
                List Your Crop Directly
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Crop add option yahin hai. Farmer login ke baad isi card se direct crop add karo.
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-4 text-center">
              <p className="text-sm font-semibold text-slate-500">Quality Score</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{qualityScore}</p>
              <p className="mt-1 text-xs text-slate-500">Moisture level se auto grade</p>
            </div>
          </div>

          <form onSubmit={handleCropSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              name="type"
              value={cropForm.type}
              onChange={handleCropChange}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              {cropTypes.slice(1).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" name="quantity" type="number" placeholder="Quantity (tons)" value={cropForm.quantity} onChange={handleCropChange} required />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" name="moisture" type="number" placeholder="Moisture %" value={cropForm.moisture} onChange={handleCropChange} required />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" name="price" type="number" placeholder="Base price (per ton)" value={cropForm.price} onChange={handleCropChange} required />
            <input className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3" name="location" placeholder="Location" value={cropForm.location} onChange={handleCropChange} required />
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Listed crops instantly company marketplace me dikhte hain.
              </div>
              <button type="submit" disabled={loading} className="rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
                {loading ? "Listing Crop..." : "List Crop"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                Company Marketplace
              </p>
              <h3 className="mt-4 text-2xl font-black text-slate-900">Buy Direct From Farmers</h3>
              <p className="mt-1 text-sm text-slate-500">Farmer listings yahan live dikhte hain. Kisi crop par direct deal lock karo.</p>
            </div>
            <div className="rounded-3xl bg-orange-50 px-5 py-4">
              <p className="text-sm font-semibold text-orange-700">Available Listings</p>
              <p className="mt-1 text-3xl font-black text-orange-600">{marketplaceCrops.length}</p>
            </div>
          </div>
          {renderMarketplaceCards()}
        </div>
      )}

      <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
        <p className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
          User Profile & Deal History
        </p>
        <h3 className="mt-4 text-2xl font-black text-slate-900">My Deals & Transactions</h3>
        <div className="mt-5 grid gap-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Role:</span> {user.role}</p>
            <p><span className="font-semibold">Location:</span> {user.location}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
          {renderDealList(deals.slice(0, 3), true)}
        </div>
      </div>
    </div>
  );

  const renderMarketplaceCards = () => (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search crops, farmer, location"
          className="rounded-2xl border border-slate-200 px-4 py-3"
        />
        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        >
          {cropTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={selectedGrade}
          onChange={(event) => setSelectedGrade(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        >
          {gradeTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {marketplaceCrops.length ? (
          marketplaceCrops.map((crop) => (
            <article key={crop._id} className="rounded-[24px] border border-emerald-100 bg-gradient-to-b from-white to-emerald-50 p-5">
              <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                No-Middleman Verified
              </div>
              <h4 className="mt-3 text-xl font-black text-slate-900">{crop.type}</h4>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>Farmer: {crop.farmer?.name || "Unknown"}</p>
                <p>Location: {crop.location}</p>
                <p>Quantity: {crop.quantity} tons</p>
                <p>Grade: {crop.grade}</p>
              </div>
              <p className="mt-4 text-xl font-black text-emerald-700">Rs. {crop.price} / ton</p>
              {role === "company" ? (
                <button onClick={() => handleLock(crop)} disabled={loading} className="mt-4 w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
                  {loading ? "Locking..." : "Buy Direct"}
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500 md:col-span-2 xl:col-span-3">
            Abhi farmer listings available nahi hain. Farmer account se crop add karo, phir company dashboard me yahin dikh jayega.
          </div>
        )}
      </div>
    </>
  );

  const renderMyCrops = () => (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
      <h3 className="text-2xl font-black text-slate-900">My Crops</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {ownCrops.length ? ownCrops.map((crop) => (
          <div key={crop._id} className="rounded-[24px] border border-slate-200 p-5">
            <h4 className="text-xl font-black text-slate-900">{crop.type}</h4>
            <p className="mt-2 text-sm text-slate-600">Quantity: {crop.quantity} tons</p>
            <p className="text-sm text-slate-600">Moisture: {crop.moisture}%</p>
            <p className="text-sm text-slate-600">Grade: {crop.grade}</p>
            <p className="mt-2 font-bold text-emerald-700">Rs. {crop.price}/ton</p>
            <button
              onClick={() => onDeleteCrop(crop._id)}
              disabled={loading}
              className="mt-4 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Delete Crop
            </button>
          </div>
        )) : (
          <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500 md:col-span-2">
            Abhi tak tumne koi crop list nahi kiya hai.
          </div>
        )}
      </div>
    </div>
  );

  const renderDealList = (items, compact = false) => {
    if (!items.length) {
      return (
        <div className="rounded-2xl bg-slate-50 p-4">
          Abhi koi transaction nahi hai.
        </div>
      );
    }

    return items.map((deal) => (
      <div key={deal._id} className="rounded-2xl border border-slate-200 p-4">
        <p className="font-semibold text-slate-900">{deal.crop?.type || "Unknown Crop"}</p>
        <p>Quantity: {deal.crop?.quantity || "-"} tons</p>
        <p>Price: Rs. {deal.price}</p>
        <p>Status: {deal.status}</p>
        <p>
          {role === "farmer"
            ? `Interested Company: ${deal.company?.name || "Unknown"}`
            : `Farmer: ${deal.farmer?.name || "Unknown"}`}
        </p>
        {!compact && deal.status === "locked" ? (
          <button
            onClick={() => onUpdateDealStatus(deal._id, "completed")}
            disabled={loading}
            className="mt-3 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Mark Completed
          </button>
        ) : null}
      </div>
    ));
  };

  const renderProfile = () => (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
      <h3 className="text-2xl font-black text-slate-900">Profile</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-700">Name</p>
          <p className="mt-2 text-2xl font-black text-emerald-900">{user.name}</p>
        </div>
        <div className="rounded-3xl bg-orange-50 p-5">
          <p className="text-sm font-semibold text-orange-700">Role</p>
          <p className="mt-2 text-2xl font-black text-orange-700">{user.role}</p>
        </div>
        <div className="rounded-3xl bg-slate-100 p-5">
          <p className="text-sm font-semibold text-slate-700">Location</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{user.location}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-5 text-white">
          <p className="text-sm font-semibold text-slate-200">Email</p>
          <p className="mt-2 break-all text-xl font-black">{user.email}</p>
        </div>
      </div>
    </div>
  );

  const renderPanelContent = () => {
    switch (activePanel) {
      case "Add Crop":
        return renderOverview();
      case "Marketplace":
        return (
          <div className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
              <h3 className="text-2xl font-black text-slate-900">Marketplace</h3>
              {renderMarketplaceCards()}
            </div>
            <MarketGraph crops={crops} />
          </div>
        );
      case "My Crops":
        return renderMyCrops();
      case "My Deals":
      case "Transactions":
        return (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
              <h3 className="text-2xl font-black text-slate-900">Locked Deals</h3>
              <div className="mt-5 grid gap-3">{renderDealList(lockedDeals)}</div>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
              <h3 className="text-2xl font-black text-slate-900">Completed Deals</h3>
              <div className="mt-5 grid gap-3">{renderDealList(completedDeals)}</div>
            </div>
          </div>
        );
      case "Profile":
        return renderProfile();
      case "Dashboard":
      default:
        return (
          <div className="space-y-6">
            {renderOverview()}
            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <MarketGraph crops={crops} />
              <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
                <p className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Marketplace Snapshot
                </p>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-3xl bg-emerald-50 p-5">
                    <p className="text-sm font-semibold text-emerald-700">Total Crops Listed</p>
                    <p className="mt-2 text-4xl font-black text-emerald-900">{crops.length}</p>
                  </div>
                  <div className="rounded-3xl bg-orange-50 p-5">
                    <p className="text-sm font-semibold text-orange-700">My Listings</p>
                    <p className="mt-2 text-4xl font-black text-orange-700">{ownCrops.length}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-5">
                    <p className="text-sm font-semibold text-slate-700">Total Deals</p>
                    <p className="mt-2 text-4xl font-black text-slate-900">{deals.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <section className="mx-auto mt-8 max-w-7xl px-4">
        <div className="rounded-[28px] bg-white p-8 text-center shadow-[0_20px_60px_rgba(16,24,40,0.12)]">
          <h2 className="text-3xl font-black text-slate-900">Working Marketplace Preview</h2>
          <p className="mt-3 text-slate-600">
            Login as farmer to add crop, ya company ke roop me login karke direct deals lock karo.
          </p>
          <button
            onClick={() => onViewChange("register")}
            className="mt-6 rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white"
          >
            Start Now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 grid max-w-7xl gap-6 px-4 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-[28px] bg-[linear-gradient(180deg,#0f3d28,#14532d)] p-6 text-white shadow-[0_20px_60px_rgba(16,24,40,0.18)]">
        <div className="border-b border-white/10 pb-4">
          <p className="text-2xl font-black">AgriDirect</p>
          <p className="mt-1 text-sm text-emerald-100">
            {role === "farmer" ? "Farmer Dashboard" : "Company Marketplace"}
          </p>
        </div>
        <div className="mt-5 space-y-2">
          {(roleMenu[role] || roleMenu.company).map((item) => (
            <button
              key={item}
              onClick={() => setActivePanel(item)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                activePanel === item ? "bg-white text-emerald-900" : "bg-white/10 text-white/90"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-emerald-50">
          <p className="font-semibold">{user.name}</p>
          <p>{user.email}</p>
          <p>{user.location}</p>
        </div>
      </aside>

      <div className="space-y-6">
        {renderPanelContent()}
      </div>

      {modalData ? (
        <Modal
          close={() => setModalData(null)}
          title={modalData.title}
          message={modalData.message}
        />
      ) : null}
    </section>
  );
}
