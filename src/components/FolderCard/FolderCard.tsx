import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dotColor } from "../../lib/utils";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import type { ContextMenuItem } from "../ContextMenu/ContextMenu";
import { GROUP_ICONS, DOT_COLORS } from "../../lib/constants";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import type { DragControls } from "framer-motion";

type FolderCardProps = {
  id: string;
  name: string;
  count: number;
  icon?: string;
  iconColor?: string;
  onClick: () => void;
  dragControls?: DragControls;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  onUpdateAppearance?: (icon: string, iconColor: string) => void;
};

export function FolderCard({
  id,
  name,
  count,
  icon,
  iconColor,
  onClick,
  dragControls,
  onRename,
  onDelete,
  onUpdateAppearance,
}: FolderCardProps) {
  const isUngrouped = id === "ungrouped";
  const color = iconColor ?? (isUngrouped ? "#94a3b8" : dotColor(id));
  const iconDef = GROUP_ICONS.find((i) => i.id === icon);
  const IconComponent = iconDef?.icon;

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editIcon, setEditIcon] = useState(icon ?? "folder");
  const [editColor, setEditColor] = useState(iconColor ?? (isUngrouped ? "#94a3b8" : dotColor(id)));

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!onRename && !onDelete) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const openSettings = () => {
    setEditName(name);
    setEditIcon(icon ?? "folder");
    setEditColor(iconColor ?? (isUngrouped ? "#94a3b8" : dotColor(id)));
    setShowSettings(true);
  };

  const handleSave = () => {
    const n = editName.trim();
    if (n && n !== name) onRename?.(n);
    if (onUpdateAppearance) onUpdateAppearance(editIcon, editColor);
    setShowSettings(false);
  };

  const contextMenuItems: ContextMenuItem[] = [
    ...(onRename || onUpdateAppearance ? [{ label: "Settings", onClick: openSettings }] : []),
    ...(onDelete ? [{ label: "Delete", onClick: () => setShowDeleteModal(true), isDanger: true }] : []),
  ];

  return (
    <>
      <div
        className="relative flex flex-row items-center gap-3 bg-white rounded-2xl p-4 cursor-pointer border border-gray-200 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-300 text-left"
        onClick={onClick}
        onContextMenu={handleContextMenu}
      >
        {/* Drag handle - only show if dragControls provided */}
        {dragControls && (
          <button
            className="touch-none flex items-center justify-center w-6 h-6 shrink-0 text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragControls.start(e);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
              <circle cx="3" cy="2" r="1.4" />
              <circle cx="7" cy="2" r="1.4" />
              <circle cx="3" cy="7" r="1.4" />
              <circle cx="7" cy="7" r="1.4" />
              <circle cx="3" cy="12" r="1.4" />
              <circle cx="7" cy="12" r="1.4" />
            </svg>
          </button>
        )}

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "20" }}>
          {IconComponent ? (
            <IconComponent size={16} color={color} />
          ) : isUngrouped ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(() => {
                const DefaultIcon = GROUP_ICONS[0].icon;
                return <DefaultIcon size={16} color={color} />;
              })()}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {(() => {
                const FolderIcon = GROUP_ICONS.find(i => i.id === "folder")?.icon || GROUP_ICONS[0].icon;
                return <FolderIcon size={16} color={color} />;
              })()}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-900 truncate">{name}</span>
          <span className="block text-xs text-gray-400">
            {count} {count === 1 ? "group" : "groups"}
          </span>
        </div>
      </div>

      <ContextMenu
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        items={contextMenuItems}
        isOpen={contextMenu !== null}
        onClose={() => setContextMenu(null)}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete folder?"
        message={`Delete "${name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={() => {
          onDelete?.();
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-xs mx-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Folder settings</h3>

                {/* Preview */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: editColor + "20" }}>
                    {(() => {
                      const iconDef = GROUP_ICONS.find((i) => i.id === editIcon) ?? GROUP_ICONS[0];
                      const PreviewIcon = iconDef.icon;
                      return <PreviewIcon size={20} color={editColor} />;
                    })()}
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-1.5">Name</p>
                <input
                  className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") setShowSettings(false);
                  }}
                />

                {/* Color swatches */}
                <p className="text-xs text-gray-400 mb-2">Color</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {DOT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditColor(c)}
                      className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                      style={{ background: c, outline: editColor === c ? `2px solid ${c}` : "2px solid transparent", outlineOffset: "2px" }}
                    />
                  ))}
                </div>

                {/* Icon grid */}
                <p className="text-xs text-gray-400 mb-2">Icon</p>
                <div className="grid grid-cols-4 gap-1 mb-5">
                  {GROUP_ICONS.map((ic) => {
                    const IconOption = ic.icon;
                    return (
                      <button
                        key={ic.id}
                        onClick={() => setEditIcon(ic.id)}
                        className="flex items-center justify-center h-10 rounded-lg cursor-pointer transition-colors"
                        style={{ background: editIcon === ic.id ? editColor + "18" : undefined }}
                        title={ic.label}
                      >
                        <IconOption size={16} color={editIcon === ic.id ? editColor : "#9ca3af"} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 p-5 border-t border-gray-100">
                <button
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:opacity-80 transition-opacity border-none cursor-pointer"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
