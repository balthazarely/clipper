import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import { Reorder, motion, useDragControls, AnimatePresence } from "framer-motion";
import { GroupCard } from "../components/GroupCard/GroupCard";
import type { ShellContext } from "../components/Shell/Shell";
import type { Folder, TabGroup } from "../lib/types";

function SortableCard({
  g,
  folders,
  onDelete,
  onMove,
  onUpdate,
  onRename,
  onCreateFolder,
}: {
  g: TabGroup;
  folders: Folder[];
  onDelete: () => void;
  onMove: (folderId: string | undefined) => void;
  onUpdate: (tabs: import("../lib/types").SavedTab[]) => void;
  onRename: (newName: string) => void;
  onCreateFolder: (name: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={g}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      className="flex-1 min-w-0"
    >
      <GroupCard
        g={g}
        folders={folders}
        onDelete={onDelete}
        onMove={onMove}
        onUpdate={onUpdate}
        onRename={onRename}
        onCreateFolder={onCreateFolder}
        dragControls={controls}
      />
    </Reorder.Item>
  );
}

function getDepth(pathname: string): number {
  if (pathname.startsWith("/folders/")) return 2;
  if (pathname === "/folders") return 1;
  return 0;
}

export function FolderDetailPage({ context }: { context: ShellContext }) {
  const {
    folders,
    groups,
    deleteGroup,
    deleteFolder,
    moveGroup,
    reorderGroups,
    updateGroup,
    updateFolder,
    renameGroup,
  } = context;
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editName, setEditName] = useState("");
  const prevDepthRef = useRef<number>(getDepth(location.pathname));
  const folderGroupsCacheRef = useRef<TabGroup[]>([]);
  const folderTitleCacheRef = useRef<string>("");

  useEffect(() => {
    prevDepthRef.current = getDepth(location.pathname);
  }, [location.pathname]);

  const isExitingByGoingBack = getDepth(location.pathname) < prevDepthRef.current;
  const isUngrouped = folderId === "ungrouped";
  const folder = folders.find((f) => f.id === folderId);

  // Calculate title and cache it when folderId is valid
  const calculatedTitle = isUngrouped ? "Ungrouped" : (folder?.name ?? "Folder");
  const title = folderId ? (folderTitleCacheRef.current = calculatedTitle) : folderTitleCacheRef.current;

  // Calculate folderGroups based on folderId, using cached value if folderId is undefined
  const calculatedFolderGroups =
    folderId && isUngrouped
      ? groups.filter((g) => !g.folderId)
      : folderId
        ? groups.filter((g) => g.folderId === folderId)
        : [];

  // Update cache when folderId is valid, use cache when folderId becomes undefined (during exit)
  const folderGroups = folderId ? (folderGroupsCacheRef.current = calculatedFolderGroups) : folderGroupsCacheRef.current;

  const [localOrder, setLocalOrder] = useState<TabGroup[]>(folderGroups);

  // Reset when switching folders
  useEffect(() => {
    setLocalOrder(folderGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  // Sync additions/deletions from outside while preserving manual order
  useEffect(() => {
    const groupMap = new Map(folderGroups.map((g) => [g.id, g]));
    const folderIds = new Set(folderGroups.map((g) => g.id));
    const kept = localOrder
      .filter((g) => folderIds.has(g.id))
      .map((g) => groupMap.get(g.id)!);
    const keptIds = new Set(kept.map((g) => g.id));
    const added = folderGroups.filter((g) => !keptIds.has(g.id));
    setLocalOrder([...kept, ...added]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  const filteredGroups = search
    ? folderGroups.filter(
        (g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : localOrder;

  const handleReorder = (newOrder: TabGroup[]) => {
    setLocalOrder(newOrder);
    reorderGroups(newOrder);
  };

  const handleSaveFolderName = () => {
    const trimmedName = editName.trim();
    if (trimmedName && folderId && !isUngrouped) {
      updateFolder(folderId, trimmedName);
    }
    setShowSettingsModal(false);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
    >
      {/* <div className="flex items-center gap-2 mx-3 mt-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder:text-gray-400"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      <div className="flex items-center gap-2 px-4 pt-2 pb-3">
        <button
          className="bg-transparent border-none text-lg text-gray-500 cursor-pointer px-1.5 py-0.5 rounded-md leading-none hover:bg-gray-200"
          onClick={() => navigate("/folders")}
        >
          ←
        </button>
        <span className="text-sm font-bold text-gray-900 flex-1 text-left">
          {title}
        </span>
        {!isUngrouped && (
          <button
            className="flex items-center justify-center w-6 h-6 shrink-0 text-gray-300 cursor-pointer hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
            onClick={() => {
              setShowSettingsModal(true);
              setEditName(folder?.name ?? "");
            }}
            title="Folder settings"
          >
            ⚙
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4">

        {filteredGroups.length === 0 ? (
          <p className="text-center text-gray-400 text-[13px] p-5">
            {folderGroups.length === 0
              ? "No groups here yet."
              : "No groups match your search."}
          </p>
        ) : search ? (
          <div className="flex flex-col gap-2.5">
            {filteredGroups.map((g) => (
              <GroupCard
                key={g.id}
                g={g}
                folders={folders}
                onDelete={() => deleteGroup(g.id)}
                onMove={(fid) => moveGroup(g.id, fid)}
                onUpdate={(tabs) => updateGroup(g.id, tabs)}
                onRename={(newName) => renameGroup(g.id, newName)}
                onCreateFolder={context.createFolder}
              />
            ))}
          </div>
        ) : (
          <Reorder.Group
            as="div"
            axis="y"
            values={localOrder}
            onReorder={handleReorder}
            className="flex flex-col gap-2.5"
          >
            {localOrder.map((g) => (
              <SortableCard
                key={g.id}
                g={g}
                folders={folders}
                onDelete={() => deleteGroup(g.id)}
                onMove={(fid) => moveGroup(g.id, fid)}
                onUpdate={(tabs) => updateGroup(g.id, tabs)}
                onRename={(newName) => renameGroup(g.id, newName)}
                onCreateFolder={context.createFolder}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-sm mx-4"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Folder settings
                </h3>

                {/* Rename section */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Folder name
                  </label>
                  <input
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                    onClick={handleSaveFolderName}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border-none cursor-pointer"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-sm mx-4"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete folder?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer"
                    onClick={() => {
                      deleteFolder(folderId!);
                      navigate("/folders");
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
