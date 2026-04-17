import { useState } from "react";
import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion";
import type { Folder, SavedTab, TabGroup } from "../../lib/types";
import { CARD_ACCORDION_ICON_TRANSITION, CARD_ACCORDION_TRANSITION, GROUP_ICONS, DOT_COLORS } from "../../lib/constants";
import { dotColor } from "../../lib/utils";
import type { DragControls } from "framer-motion";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import type { ContextMenuItem } from "../ContextMenu/ContextMenu";
import { FolderSelectModal } from "../FolderSelectModal/FolderSelectModal";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";

function TabRow({ tab, onDelete }: { tab: SavedTab; onDelete: () => void }) {
  const controls = useDragControls();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <Reorder.Item as="div" value={tab} dragListener={false} dragControls={controls}>
      <div
        className="group flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50"
        onClick={() => chrome.tabs.create({ url: tab.url })}
      >
        {/* Drag handle */}
        <button
          className="touch-none shrink-0 text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            controls.start(e);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
            <circle cx="2" cy="1.5" r="1.2" />
            <circle cx="6" cy="1.5" r="1.2" />
            <circle cx="2" cy="6" r="1.2" />
            <circle cx="6" cy="6" r="1.2" />
            <circle cx="2" cy="10.5" r="1.2" />
            <circle cx="6" cy="10.5" r="1.2" />
          </svg>
        </button>

        {/* Favicon */}
        {tab.favIconUrl ? (
          <img src={tab.favIconUrl} className="w-3.5 h-3.5 shrink-0 rounded-sm" alt="" />
        ) : (
          <span className="w-3.5 h-3.5 shrink-0 bg-gray-200 rounded-sm block" />
        )}

        {/* Title */}
        <span className="flex-1 text-[13px] text-gray-800 truncate">{tab.title}</span>

        {/* Delete */}
        {!showDeleteConfirm ? (
          <button
            className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all w-5 h-5 flex items-center justify-center rounded text-base leading-none cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
          >
            ×
          </button>
        ) : (
          <div className="shrink-0 flex gap-1">
            <button
              className="text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all px-2 py-0.5 flex items-center justify-center rounded text-xs leading-none cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
            >
              Cancel
            </button>
            <button
              className="text-red-600 bg-red-50 hover:bg-red-100 transition-all px-2 py-0.5 flex items-center justify-center rounded text-xs leading-none cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Reorder.Item>
  );
}

export function GroupCard({
  g,
  folders,
  onDelete,
  onMove,
  onUpdate,
  onRename,
  onUpdateAppearance,
  onCreateFolder,
  onUpdateDescription,
  onUpdateLabel,
  dragControls,
}: {
  g: TabGroup;
  folders: Folder[];
  onDelete: () => void;
  onMove: (folderId: string | undefined) => void;
  onUpdate: (tabs: SavedTab[]) => void;
  onRename: (newName: string) => void;
  onUpdateAppearance: (icon: string, iconColor: string) => void;
  onCreateFolder: (name: string) => void;
  onUpdateDescription?: (description: string) => void;
  onUpdateLabel?: (label: string) => void;
  dragControls?: DragControls;
}) {
  const [open, setOpen] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editIcon, setEditIcon] = useState(g.icon ?? GROUP_ICONS[0].id);
  const [editColor, setEditColor] = useState(g.iconColor ?? dotColor(g.id));
  const [editName, setEditName] = useState(g.name);
  const [editDescription, setEditDescription] = useState(g.description ?? "");
  const [editLabel, setEditLabel] = useState(g.label ?? "");

  const color = g.iconColor ?? dotColor(g.id);
  const iconDef = GROUP_ICONS.find((i) => i.id === g.icon) ?? GROUP_ICONS[0];
  const IconComponent = iconDef.icon;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: "Settings",
      onClick: () => {
        setEditIcon(g.icon ?? GROUP_ICONS[0].id);
        setEditColor(g.iconColor ?? dotColor(g.id));
        setEditName(g.name);
        setEditDescription(g.description ?? "");
        setEditLabel(g.label ?? "");
        setShowAppearanceModal(true);
      },
    },
    {
      label: "Move to folder",
      onClick: () => {
        setShowMoveModal(true);
      },
    },
    {
      label: "Delete",
      onClick: () => setShowDeleteModal(true),
      isDanger: true,
    },
  ];

  const handleDeleteTab = (index: number) => {
    onUpdate(g.tabs.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    const raw = newUrl.trim();
    if (!raw) return;
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let title = url;
    try {
      title = new URL(url).hostname;
    } catch {
      /* keep url as title */
    }
    onUpdate([...g.tabs, { title, url }]);
    setNewUrl("");
    setShowAddLink(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm text-left">
      {/* Header row */}
      <div className="w-full flex items-center gap-2 px-2 py-3 text-left" onContextMenu={handleContextMenu}>
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

        <button className="flex-1 flex items-center gap-3 bg-transparent border-none cursor-pointer" onClick={() => setOpen((v) => !v)}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              flexShrink: 0,
              background: color + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconComponent size={16} color={color} />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">{g.name}</p>
            <p className="text-xs text-gray-400 truncate">{g.description || `${g.tabs.length} tab${g.tabs.length !== 1 ? "s" : ""}`}</p>
          </div>

          <svg
            style={{
              flexShrink: 0,
              color: "#d1d5db",
              transition: CARD_ACCORDION_ICON_TRANSITION,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Expanded - with animation */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="border-t border-gray-100 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={CARD_ACCORDION_TRANSITION}
          >
            <div className="py-3">
              {g.label && (
                <div className="px-4 pb-3">
                  <span className="inline-block text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                    {g.label}
                  </span>
                </div>
              )}

              <Reorder.Group as="div" axis="y" values={g.tabs} onReorder={onUpdate} className="flex flex-col py-1.5">
                {g.tabs.map((t, i) => (
                  <TabRow key={`${t.url}-${t.title}`} tab={t} onDelete={() => handleDeleteTab(i)} />
                ))}
              </Reorder.Group>

              <div className="px-4 pb-0 pt-1 flex flex-col gap-2">
                {showAddLink ? (
                  <div className="flex gap-1.5">
                    <input
                      className="flex-1 text-[12px] px-2.5 py-1.5 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-400 placeholder:text-gray-300"
                      placeholder="Paste a URL..."
                      value={newUrl}
                      autoFocus
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddLink();
                        if (e.key === "Escape") {
                          setShowAddLink(false);
                          setNewUrl("");
                        }
                      }}
                    />
                    <button
                      className="font-[inherit] text-[11px] font-medium px-2.5 py-1.5 rounded-md border-none cursor-pointer bg-gray-900 text-white disabled:opacity-40"
                      disabled={!newUrl.trim()}
                      onClick={handleAddLink}
                    >
                      Add
                    </button>
                    <button
                      className="font-[inherit] text-[11px] font-medium px-2 py-1.5 rounded-md border-none cursor-pointer bg-gray-100 text-gray-600"
                      onClick={() => {
                        setShowAddLink(false);
                        setNewUrl("");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    className="font-[inherit] text-xs text-indigo-500 bg-transparent border border-dashed border-indigo-200 rounded-lg px-3 py-1.5 cursor-pointer text-left transition-colors hover:bg-indigo-50"
                    onClick={() => setShowAddLink(true)}
                  >
                    + Add link
                  </button>
                )}

                <button
                  className="font-[inherit] bg-transparent border border-gray-200 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-indigo-50 text-left"
                  onClick={() => g.tabs.forEach((t) => chrome.tabs.create({ url: t.url }))}
                >
                  Open all {g.tabs.length} tabs
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContextMenu
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        items={contextMenuItems}
        isOpen={contextMenu !== null}
        onClose={() => setContextMenu(null)}
      />


      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete group?"
        message={`Delete "${g.name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />

      <FolderSelectModal
        isOpen={showMoveModal}
        folders={folders}
        onSelect={(folderId) => {
          onMove(folderId);
          setShowMoveModal(false);
        }}
        onCreateAndSelect={(folderName) => {
          // createFolder uses Date.now() as the ID, so we can predict it
          const newFolderId = String(Date.now());
          onCreateFolder(folderName);
          onMove(newFolderId);
        }}
        onClose={() => setShowMoveModal(false)}
      />

      {/* Appearance modal */}
      <AnimatePresence>
        {showAppearanceModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAppearanceModal(false)}
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
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Settings</h3>

                {/* Name */}
                <p className="text-xs text-gray-400 mb-1.5">Name</p>
                <input
                  className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const n = editName.trim();
                      if (n) {
                        onRename(n);
                      }
                      onUpdateAppearance(editIcon, editColor);
                      onUpdateDescription?.(editDescription);
                      onUpdateLabel?.(editLabel);
                      setShowAppearanceModal(false);
                    }
                    if (e.key === "Escape") setShowAppearanceModal(false);
                  }}
                />

                {/* Description */}
                <p className="text-xs text-gray-400 mb-1.5">Description</p>
                <input
                  className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                  placeholder="Optional description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                {/* Label / Tag */}
                <p className="text-xs text-gray-400 mb-1.5">Label</p>
                <input
                  className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                  placeholder="Optional label (e.g., 'Work', 'Personal')"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                />

                {/* Preview */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: editColor + "18" }}>
                    {(() => {
                      const PreviewIcon = (GROUP_ICONS.find((i) => i.id === editIcon) ?? GROUP_ICONS[0]).icon;
                      return <PreviewIcon size={20} color={editColor} />;
                    })()}
                  </div>
                </div>

                {/* Color swatches */}
                <p className="text-xs text-gray-400 mb-2">Color</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {DOT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditColor(c)}
                      className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                      style={{
                        background: c,
                        outline: editColor === c ? `2px solid ${c}` : "2px solid transparent",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>

                {/* Icon grid */}
                <p className="text-xs text-gray-400 mb-2">Icon</p>
                <div className="grid grid-cols-4 gap-1 mb-5">
                  {GROUP_ICONS.map((iconDef) => {
                    const IconOption = iconDef.icon;
                    return (
                      <button
                        key={iconDef.id}
                        onClick={() => setEditIcon(iconDef.id)}
                        className="flex items-center justify-center h-10 rounded-lg cursor-pointer transition-colors"
                        style={{ background: editIcon === iconDef.id ? editColor + "18" : undefined }}
                        title={iconDef.label}
                      >
                        <IconOption size={16} color={editIcon === iconDef.id ? editColor : "#9ca3af"} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-5 border-t border-gray-100">
                <button
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:opacity-80 transition-opacity border-none cursor-pointer"
                  onClick={() => {
                    const n = editName.trim();
                    if (n && n !== g.name) onRename(n);
                    onUpdateAppearance(editIcon, editColor);
                    onUpdateDescription?.(editDescription);
                    onUpdateLabel?.(editLabel);
                    setShowAppearanceModal(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                  onClick={() => setShowAppearanceModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
