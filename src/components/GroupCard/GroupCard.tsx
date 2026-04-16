import { useState } from "react";
import {
  Reorder,
  useDragControls,
  AnimatePresence,
  motion,
} from "framer-motion";
import type { Folder, SavedTab, TabGroup } from "../../lib/types";
import { dotColor } from "../../lib/utils";
import type { DragControls } from "framer-motion";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import type { ContextMenuItem } from "../ContextMenu/ContextMenu";
import { FolderSelectModal } from "../FolderSelectModal/FolderSelectModal";

function TabRow({ tab, onDelete }: { tab: SavedTab; onDelete: () => void }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={tab}
      dragListener={false}
      dragControls={controls}
    >
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
          <img
            src={tab.favIconUrl}
            className="w-3.5 h-3.5 shrink-0 rounded-sm"
            alt=""
          />
        ) : (
          <span className="w-3.5 h-3.5 shrink-0 bg-gray-200 rounded-sm block" />
        )}

        {/* Title */}
        <span className="flex-1 text-[13px] text-gray-800 truncate">
          {tab.title}
        </span>

        {/* Delete */}
        <button
          className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all w-5 h-5 flex items-center justify-center rounded text-base leading-none"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </button>
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
  onCreateFolder,
  dragControls,
}: {
  g: TabGroup;
  folders: Folder[];
  onDelete: () => void;
  onMove: (folderId: string | undefined) => void;
  onUpdate: (tabs: SavedTab[]) => void;
  onRename: (newName: string) => void;
  onCreateFolder: (name: string) => void;
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
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(g.name);

  const color = dotColor(g.id);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleSaveRename = () => {
    const trimmedName = newName.trim();
    if (trimmedName && trimmedName !== g.name) {
      onRename(trimmedName);
    }
    setIsRenaming(false);
    setNewName(g.name);
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewName(g.name);
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: "Move to folder",
      onClick: () => {
        setShowMoveModal(true);
      },
    },
    {
      label: "Rename",
      onClick: () => {
        setIsRenaming(true);
        setNewName(g.name);
      },
    },
    {
      label: "Delete",
      onClick: onDelete,
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
      <div
        className="w-full flex items-center gap-2 px-2 py-3 text-left"
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

        <button
          className="flex-1 flex items-center gap-3 bg-transparent border-none cursor-pointer"
          onClick={() => !isRenaming && setOpen((v) => !v)}
        >
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
              <rect x="2" y="3" width="20" height="4" rx="1" />
              <rect x="2" y="10" width="20" height="4" rx="1" />
              <rect x="2" y="17" width="20" height="4" rx="1" />
            </svg>
          </div>

          <div className="flex-1 min-w-0 text-left">
            {isRenaming ? (
              <input
                className="w-full text-sm font-semibold px-2 py-0.5 rounded border border-indigo-400 outline-none bg-white text-gray-900 focus:ring-1 focus:ring-indigo-500 mb-0.5"
                value={newName}
                autoFocus
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveRename();
                  if (e.key === "Escape") handleCancelRename();
                }}
                onBlur={handleSaveRename}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                {g.name}
              </p>
            )}
            <p className="text-xs text-gray-400 truncate">
              {g.description ||
                `${g.tabs.length} tab${g.tabs.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <svg
            style={{
              flexShrink: 0,
              color: "#d1d5db",
              transition: "transform 0.2s",
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
            transition={{
              height: {
                type: "spring",
                stiffness: 500,
                damping: 35,
                mass: 0.5,
              },
              opacity: { duration: 0.15 },
            }}
          >
            <div className="py-3">
              {g.label && (
                <div className="px-4 pb-3">
                  <span className="inline-block text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                    {g.label}
                  </span>
                </div>
              )}

              <Reorder.Group
                as="div"
                axis="y"
                values={g.tabs}
                onReorder={onUpdate}
                className="flex flex-col py-1.5"
              >
                {g.tabs.map((t, i) => (
                  <TabRow
                    key={`${t.url}-${t.title}`}
                    tab={t}
                    onDelete={() => handleDeleteTab(i)}
                  />
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
                  onClick={() =>
                    g.tabs.forEach((t) => chrome.tabs.create({ url: t.url }))
                  }
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
    </div>
  );
}
