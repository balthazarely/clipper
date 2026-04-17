import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Folder } from "../../lib/types";
import { dotColor } from "../../lib/utils";

type FolderSelectModalProps = {
  isOpen: boolean;
  folders: Folder[];
  onSelect: (folderId: string | undefined) => void;
  onCreateAndSelect: (folderName: string) => void;
  onClose: () => void;
};

export function FolderSelectModal({
  isOpen,
  folders,
  onSelect,
  onCreateAndSelect,
  onClose,
}: FolderSelectModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 max-w-sm w-full mx-4"
          >
            <div className="p-5">
              {!isCreating ? (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Move to folder
                  </h2>

                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {/* Ungrouped option */}
                <button
                  onClick={() => {
                    onSelect(undefined);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-center cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#94a3b8" + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="3" width="20" height="4" rx="1" />
                      <rect x="2" y="10" width="20" height="4" rx="1" />
                      <rect x="2" y="17" width="20" height="4" rx="1" />
                    </svg>
                  </motion.div>
                  <span className="text-xs font-medium text-gray-900 truncate w-full">
                    Ungrouped
                  </span>
                </button>

                {/* Folder options */}
                {folders.map((folder) => {
                  const color = dotColor(folder.id);
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        onSelect(folder.id);
                        onClose();
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-center cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: color + "20",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                      </motion.div>
                      <span className="text-xs font-medium text-gray-900 truncate w-full">
                        {folder.name}
                      </span>
                    </button>
                  );
                })}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      + New folder
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Create new folder
                  </h2>

                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Folder name
                    </label>
                    <input
                      autoFocus
                      type="text"
                      className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="e.g. Work, Personal, Reading"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newFolderName.trim()) {
                          onCreateAndSelect(newFolderName.trim());
                          setIsCreating(false);
                          setNewFolderName("");
                          onClose();
                        }
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewFolderName("");
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (newFolderName.trim()) {
                          onCreateAndSelect(newFolderName.trim());
                          setIsCreating(false);
                          setNewFolderName("");
                          onClose();
                        }
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newFolderName.trim()}
                    >
                      Create & Move
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
