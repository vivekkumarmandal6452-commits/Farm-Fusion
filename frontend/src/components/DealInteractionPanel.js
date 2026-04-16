import { useMemo, useState } from "react";

const formatMessageTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DealInteractionPanel({
  deal,
  currentRole,
  onSendMessage,
  onRateDeal,
  loading,
}) {
  const [message, setMessage] = useState("");
  const [ratingForm, setRatingForm] = useState({
    score: deal.qualityRating?.score || 5,
    review: deal.qualityRating?.review || "",
  });

  const chatPartner = useMemo(() => {
    return currentRole === "company" ? deal.farmer : deal.company;
  }, [currentRole, deal.company, deal.farmer]);

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const success = await onSendMessage(deal._id, message);
    if (success) {
      setMessage("");
    }
  };

  const handleRatingSubmit = async (event) => {
    event.preventDefault();
    await onRateDeal(deal._id, ratingForm);
  };

  return (
    <div className="mt-4 space-y-4 rounded-[24px] bg-slate-50/85 p-4">
      <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
        <p>
          {deal.status === "inquiry"
            ? "Requested Quantity: To be discussed"
            : `Ordered Quantity: ${deal.requestedQuantity} tons`}
        </p>
        <p>
          {deal.status === "inquiry"
            ? "Delivery Location: To be discussed"
            : `Delivery Location: ${deal.deliveryLocation}`}
        </p>
        <p>Unit Price: Rs. {deal.price} / ton</p>
        <p>
          {deal.status === "inquiry"
            ? "Total Amount: Not finalized"
            : `Total Amount: Rs. ${deal.totalAmount}`}
        </p>
        <p>Platform Fee: {deal.commissionPercent}%</p>
        <p>Worker Share: {deal.workerSharePercent || 0}%</p>
      </div>

      {deal.deliveryInstructions && deal.status !== "inquiry" ? (
        <div className="rounded-2xl bg-white/90 p-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Delivery Instructions:</span>{" "}
          {deal.deliveryInstructions}
        </div>
      ) : null}

      {deal.companyNotes ? (
        <div className="rounded-2xl bg-white/90 p-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Order Notes:</span> {deal.companyNotes}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[26px] border border-emerald-100 bg-white">
        <div className="flex items-center justify-between gap-4 bg-[#1B5E20] px-5 py-4 text-white">
          <div>
            <p className="text-lg font-black">{chatPartner?.name || "Conversation"}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-100">
              {chatPartner?.role || (currentRole === "company" ? "farmer" : "company")}
            </p>
          </div>
          <div className="text-right text-xs text-emerald-100">
            <p>{chatPartner?.phone || "Phone not added yet"}</p>
            <p>{chatPartner?.location || "Location not added yet"}</p>
          </div>
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto bg-[#efeae2] px-4 py-4">
          {deal.messages?.length ? (
            deal.messages.map((entry) => {
              const ownMessage = entry.senderRole === currentRole;

              return (
                <div
                  key={entry._id}
                  className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-[22px] px-4 py-3 shadow-sm ${
                      ownMessage
                        ? "rounded-br-md bg-[#dcf8c6] text-slate-900"
                        : "rounded-bl-md bg-white text-slate-900"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      {entry.sender?.name || entry.senderRole}
                    </p>
                    <p className="mt-1 text-sm leading-6">{entry.text}</p>
                    <p className="mt-2 text-right text-[11px] text-slate-500">
                      {formatMessageTime(entry.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No messages yet.</p>
          )}
        </div>

        <form onSubmit={handleMessageSubmit} className="flex gap-2 border-t border-slate-200 bg-white p-4">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={
              currentRole === "company"
                ? "Type a message for the farmer"
                : "Type a message for the company"
            }
            className="glass-input w-full rounded-full px-4 py-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#1B5E20] px-5 py-3 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>

      {currentRole === "company" ? (
        <form onSubmit={handleRatingSubmit} className="rounded-[22px] bg-white/90 p-4">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
            Rate Crop Quality
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-[120px_1fr]">
            <select
              value={ratingForm.score}
              onChange={(event) =>
                setRatingForm((current) => ({ ...current, score: event.target.value }))
              }
              className="glass-input rounded-2xl px-4 py-3"
            >
              {[5, 4, 3, 2, 1].map((score) => (
                <option key={score} value={score}>
                  {score} Star
                </option>
              ))}
            </select>
            <input
              value={ratingForm.review}
              onChange={(event) =>
                setRatingForm((current) => ({ ...current, review: event.target.value }))
              }
              placeholder="Write a quality note"
              className="glass-input rounded-2xl px-4 py-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-full bg-[#FFAB00] px-4 py-2.5 text-sm font-semibold text-slate-900 transition active:scale-95 disabled:opacity-60"
          >
            Save Rating
          </button>
        </form>
      ) : deal.qualityRating ? (
        <div className="rounded-[22px] bg-white/90 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Company Rating</p>
          <p className="mt-2">Score: {deal.qualityRating.score} / 5</p>
          <p className="mt-1">{deal.qualityRating.review || "No written review yet."}</p>
        </div>
      ) : (
        <div className="rounded-[22px] bg-white/90 p-4 text-sm text-slate-500">
          The company has not rated this crop yet.
        </div>
      )}
    </div>
  );
}
