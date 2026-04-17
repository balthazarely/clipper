import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { DOT_COLORS, ROUTE_TRANSITION } from "../lib/constants";
import { ConfirmationModal } from "../components/ConfirmationModal/ConfirmationModal";
import { ContextMenu } from "../components/ContextMenu/ContextMenu";
import type { ContextMenuItem } from "../components/ContextMenu/ContextMenu";
import type { ShellContext } from "../components/Shell/Shell";

export const LabelsPage = forwardRef<
  HTMLDivElement,
  { context: ShellContext }
>(function LabelsPage({ context }, ref) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(DOT_COLORS[0]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
      context.createLabel(newLabelName.trim(), newLabelColor);
      setNewLabelName("");
      setNewLabelColor(DOT_COLORS[0]);
      setShowCreateModal(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, labelId: string) => {
    e.preventDefault();
    setSelectedLabelId(labelId);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleSettingsClick = () => {
    if (!selectedLabelId) return;
    const label = context.labels.find((l) => l.id === selectedLabelId);
    if (label) {
      setEditingId(selectedLabelId);
      setEditingName(label.name);
      setEditingColor(label.color || DOT_COLORS[0]);
      setShowSettingsModal(true);
      setContextMenu(null);
    }
  };

  const handleSaveSettings = () => {
    if (editingId && editingName.trim()) {
      context.updateLabel(editingId, editingName.trim(), editingColor);
      setShowSettingsModal(false);
      setEditingId(null);
      setEditingName("");
      setEditingColor("");
    }
  };

  const handleDeleteClick = () => {
    if (selectedLabelId) {
      setDeleteConfirmId(selectedLabelId);
      setContextMenu(null);
    }
  };

  const contextMenuItems: ContextMenuItem[] = [
    { label: "Settings", onClick: handleSettingsClick },
    { label: "Delete", onClick: handleDeleteClick, isDanger: true },
  ];

  return (
    <>
    <motion.div
      ref={ref}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={ROUTE_TRANSITION}
    >
      <div className="flex items-center gap-2 px-4 pt-2 pb-3">
        <span className="text-sm font-bold text-gray-900 flex-1 text-left">
          Labels
        </span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4 flex-1 overflow-y-auto">
        {context.labels.length === 0 ? (
          <p className="text-center text-gray-400 text-[13px] p-5">
            No labels yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {context.labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                onContextMenu={(e) => handleContextMenu(e, label.id)}
              >
                {label.color && (
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: label.color }}
                  />
                )}
                <span
                  className="inline-block text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    background: label.color ? label.color + "15" : "#f3f4f6",
                    color: label.color || "#6b7280",
                  }}
                >
                  {label.name}
                </span>
              </div>
            ))}

            {context.labels.length > 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-[13px] text-indigo-600 bg-transparent border border-dashed border-indigo-200 rounded-xl px-3.5 py-3 cursor-pointer text-left transition-colors hover:bg-indigo-50 font-[inherit] mt-2"
              >
                + Create Label
              </button>
            )}
          </div>
        )}

        {context.labels.length === 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-[13px] text-indigo-600 bg-transparent border border-dashed border-indigo-200 rounded-xl px-3.5 py-3 cursor-pointer text-left transition-colors hover:bg-indigo-50 font-[inherit]"
          >
            + Create Label
          </button>
        )}
      </div>

      {/* Create Label Modal */}
      {showCreateModal && (
        <>
          <div
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-xs mx-4 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Create Label
            </h3>

            <input
              autoFocus
              type="text"
              placeholder="Label name (e.g., Work, Personal)"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newLabelName.trim())
                  handleCreateLabel();
                if (e.key === "Escape") setShowCreateModal(false);
              }}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
            />

            <p className="text-xs text-gray-400 mb-2">Color</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {DOT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewLabelColor(c)}
                  className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                  style={{
                    background: c,
                    outline:
                      newLabelColor === c
                        ? `2px solid ${c}`
                        : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLabel}
                disabled={!newLabelName.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div
            onClick={() => setShowSettingsModal(false)}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-xs mx-4 max-h-[90vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Settings
              </h3>

              <p className="text-xs text-gray-400 mb-1.5">Name</p>
              <input
                className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                value={editingName}
                autoFocus
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveSettings();
                  if (e.key === "Escape") setShowSettingsModal(false);
                }}
              />

              <p className="text-xs text-gray-400 mb-2">Color</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {DOT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setEditingColor(c)}
                    className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                    style={{
                      background: c,
                      outline:
                        editingColor === c
                          ? `2px solid ${c}`
                          : "2px solid transparent",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:opacity-80 transition-opacity border-none cursor-pointer"
                onClick={handleSaveSettings}
              >
                Save
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                onClick={() => setShowSettingsModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Context Menu */}
      <ContextMenu
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        items={contextMenuItems}
        isOpen={contextMenu !== null}
        onClose={() => setContextMenu(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete label?"
        message={`Delete "${context.labels.find((l) => l.id === deleteConfirmId)?.name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={() => {
          if (deleteConfirmId) {
            context.deleteLabel(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </motion.div>
    </>
  );
});
