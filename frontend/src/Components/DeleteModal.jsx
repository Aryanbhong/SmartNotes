
import { AlertTriangle } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#292720]/45 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="w-full max-w-sm rounded-2xl border border-[#E7E0D4] bg-[#FDFBF6] p-6 text-center shadow-2xl shadow-[#292720]/15 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6E8E2]">
          <AlertTriangle
            size={27}
            className="text-[#B65F43]"
            strokeWidth={1.8}
          />
        </div>

        <h2
          id="delete-modal-title"
          className="mb-2 font-display text-xl font-semibold tracking-tight text-[#292720]"
        >
          Are you sure?
        </h2>

        <p className="mb-7 text-sm leading-6 text-[#817C70]">
          This action cannot be undone. Are you sure you want to delete this
          note?
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#E7E0D4] bg-[#F1EDE3] px-4 py-2.5 text-sm font-medium text-[#292720] transition-colors hover:bg-[#E7E0D4] focus:outline-none focus:ring-2 focus:ring-[#5C6E4E]/30"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#B65F43] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#9E4F37] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#B65F43]/40 focus:ring-offset-2 focus:ring-offset-[#FDFBF6]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;