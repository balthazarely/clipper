import { motion, AnimatePresence } from "framer-motion";

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  isDangerous,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-xs mx-4 p-5"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-5">{message}</p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                onClick={onCancel}
              >
                {cancelText || "Cancel"}
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors border-none cursor-pointer text-white ${
                  isDangerous
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
                onClick={onConfirm}
              >
                {confirmText || "Confirm"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
