import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ROUTE_TRANSITION } from "../lib/constants";

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={ROUTE_TRANSITION}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 pt-2 pb-3">
        <button
          className="bg-transparent border-none text-lg text-gray-500 cursor-pointer px-1.5 py-0.5 rounded-md leading-none hover:bg-gray-200"
          onClick={() => navigate("/")}
        >
          ←
        </button>
        <span className="text-sm font-bold text-gray-900 flex-1 text-left">Settings</span>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">About</h3>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Version:</span> 1.0.0
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Name:</span> Tab Vault
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Management</h3>
          <button
            className="w-full text-left text-xs text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors border border-red-200"
            onClick={() => {
              if (confirm("Are you sure? This will delete all tab groups and folders.")) {
                chrome.storage.local.clear();
                alert("Data cleared. Please refresh the extension.");
              }
            }}
          >
            Clear all data
          </button>
        </div>
      </div>
    </motion.div>
  );
}
