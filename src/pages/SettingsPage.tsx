import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { ROUTE_TRANSITION } from "../lib/constants";
import { getDepth } from "../lib/utils";
import type { Folder, TabGroup } from "../lib/types";

export function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevDepthRef = useRef<number>(getDepth(location.pathname));

  useEffect(() => {
    prevDepthRef.current = getDepth(location.pathname);
  }, [location.pathname]);

  const handleExport = () => {
    chrome.storage.local.get(["tabGroups", "folders"], (result) => {
      const data = {
        folders: (result.folders as Folder[]) || [],
        groups: (result.tabGroups as TabGroup[]) || [],
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tab-vault-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!data.folders || !data.groups) {
          alert("Invalid backup file format");
          return;
        }

        chrome.storage.local.set({
          folders: data.folders,
          tabGroups: data.groups,
        });

        alert("Data imported successfully. Please refresh the extension.");
      } catch (error) {
        alert("Error importing data: Invalid JSON format");
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isReturning = getDepth(location.pathname) < prevDepthRef.current;

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
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Data</h3>
          <div className="space-y-2">
            <button
              className="w-full text-left text-xs text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200"
              onClick={handleExport}
            >
              Export data
            </button>
            <button
              className="w-full text-left text-xs text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200"
              onClick={handleImportClick}
            >
              Import data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
