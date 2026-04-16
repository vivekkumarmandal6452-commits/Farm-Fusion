import { useEffect, useState } from "react";

const formatDate = (value) => {
  if (!value) {
    return "Recently joined";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently joined";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function UserProfile({
  user,
  myCrops = [],
  farmerDeals = [],
  companyDeals = [],
  onUpdateProfile,
  loading,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    location: user?.location || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      location: user?.location || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "AG";

  const isFarmer = user?.role === "farmer";
  const totalListings = myCrops.length;
  const totalRequests = farmerDeals.length;
  const totalPurchases = companyDeals.length;
  const lockedDeals = (isFarmer ? farmerDeals : companyDeals).filter(
    (deal) => deal.status === "locked"
  ).length;
  const completedDeals = (isFarmer ? farmerDeals : companyDeals).filter(
    (deal) => deal.status === "completed"
  ).length;

  const details = isFarmer
    ? [
        { label: "Full Name", value: user?.name || "Not available" },
        { label: "Email Address", value: user?.email || "Not available" },
        { label: "Mobile Number", value: user?.phone || "Not added yet" },
        { label: "Role", value: "Farmer" },
        { label: "Location", value: user?.location || "Not available" },
        { label: "Verified Status", value: user?.verified ? "Verified farmer" : "Pending verification" },
        { label: "Member Since", value: formatDate(user?.createdAt) },
        { label: "Profile ID", value: user?._id || "Not available" },
        { label: "Total Crop Listings", value: String(totalListings) },
        { label: "Company Requests", value: String(totalRequests) },
        { label: "Direct Trade Model", value: "Direct crop selling with zero middlemen" },
        { label: "Locked Deals", value: String(lockedDeals) },
        { label: "Completed Deals", value: String(completedDeals) },
      ]
    : [
        { label: "Company Name", value: user?.name || "Not available" },
        { label: "Business Email", value: user?.email || "Not available" },
        { label: "Mobile Number", value: user?.phone || "Not added yet" },
        { label: "Role", value: "Company" },
        { label: "Operating Location", value: user?.location || "Not available" },
        { label: "Verified Status", value: user?.verified ? "Verified buyer" : "Pending verification" },
        { label: "Member Since", value: formatDate(user?.createdAt) },
        { label: "Profile ID", value: user?._id || "Not available" },
        { label: "Total Purchases", value: String(totalPurchases) },
        { label: "Locked Deals", value: String(lockedDeals) },
        { label: "Completed Deals", value: String(completedDeals) },
        { label: "Buying Model", value: "Direct sourcing from farmers" },
        { label: "Platform Benefit", value: "No broker margin, verified supply" },
      ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onUpdateProfile({
      name: form.name.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
    });

    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[32px] bg-white/80 p-8 shadow-[0_20px_60px_rgba(16,24,40,0.12)] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#1B5E20] to-[#FFAB00] text-3xl font-black text-white shadow-[0_20px_50px_rgba(27,94,32,0.25)]">
              {initials}
            </div>
            <p className="mt-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1B5E20]">
              Profile Overview
            </p>
            <h1 className="mt-4 text-3xl font-black text-slate-900">{user?.name}</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
              {isFarmer ? "Farmer Account" : "Company Account"}
            </p>
            <p className="mt-4 text-sm text-slate-600">
              This profile gives a complete view of account details, marketplace activity, and deal performance in one place.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
                {isFarmer ? "Listings" : "Purchases"}
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {isFarmer ? totalListings : totalPurchases}
              </p>
            </div>
            <div className="rounded-[24px] bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                Active Deals
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{lockedDeals}</p>
            </div>
            <div className="rounded-[24px] bg-slate-100 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                Completed
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">{completedDeals}</p>
            </div>
            <div className="rounded-[24px] bg-green-100 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-800">
                Contact Number
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {user?.phone || "Add in edit mode"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white/78 p-8 shadow-[0_20px_60px_rgba(16,24,40,0.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-[#f4ead7] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                Detailed Profile
              </p>
              <h2 className="mt-4 text-3xl font-black text-slate-900">Account Details</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className="rounded-full bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white transition active:scale-95"
            >
              {isEditing ? "Close Edit" : "Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="glass-input rounded-2xl px-4 py-3"
                required
              />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="glass-input rounded-2xl px-4 py-3"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Mobile number"
                className="glass-input rounded-2xl px-4 py-3 md:col-span-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 rounded-full bg-[#FFAB00] px-5 py-3 font-semibold text-slate-900 transition active:scale-95 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="rounded-[24px] border border-slate-200 bg-white/70 p-5 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {detail.label}
                </p>
                <p className="mt-3 break-words text-base font-semibold text-slate-900">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
