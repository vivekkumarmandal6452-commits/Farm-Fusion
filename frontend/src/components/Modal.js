export default function Modal({ isOpen, title, description, onClose, transactionId }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="w-full max-w-md rounded-[30px] bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-100" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-[#1B5E20]">
            {"\u2713"}
          </span>
        </div>
        <h3 className="mt-5 text-2xl font-black text-slate-900">{title}</h3>
        <p className="mt-3 text-sm text-slate-600">{description}</p>
        {transactionId ? (
          <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
            Transaction ID: {transactionId}
          </div>
        ) : null}
        <button
          onClick={onClose}
          className="mt-6 rounded-full bg-[#1B5E20] px-6 py-3 font-semibold text-white transition active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
}
