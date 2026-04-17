import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Reorder, motion } from "framer-motion";
import { SortableCard } from "../components/SortableCard/SortableCard";
import type { ShellContext } from "../components/Shell/Shell";
import type { TabGroup } from "../lib/types";
import { ROUTE_TRANSITION } from "../lib/constants";
import { getDepth } from "../lib/utils";

export function FolderDetailPage({ context }: { context: ShellContext }) {
  const { folders, groups, deleteGroup, moveGroup, reorderGroups, updateGroup, renameGroup, updateGroupAppearance, updateGroupDescription, updateGroupLabel } = context;
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const prevDepthRef = useRef<number>(getDepth(location.pathname));
  const folderGroupsCacheRef = useRef<TabGroup[]>([]);
  const folderTitleCacheRef = useRef<string>("");

  useEffect(() => {
    prevDepthRef.current = getDepth(location.pathname);
  }, [location.pathname]);

  const isUngrouped = folderId === "ungrouped";
  const folder = folders.find((f) => f.id === folderId);

  // Calculate title and cache it when folderId is valid
  const calculatedTitle = isUngrouped ? "Ungrouped" : (folder?.name ?? "Folder");
  const title = folderId ? (folderTitleCacheRef.current = calculatedTitle) : folderTitleCacheRef.current;

  // Calculate folderGroups based on folderId, using cached value if folderId is undefined
  const calculatedFolderGroups =
    folderId && isUngrouped ? groups.filter((g) => !g.folderId) : folderId ? groups.filter((g) => g.folderId === folderId) : [];

  // Update cache when folderId is valid, use cache when folderId becomes undefined (during exit)
  const folderGroups = folderId ? (folderGroupsCacheRef.current = calculatedFolderGroups) : folderGroupsCacheRef.current;

  const [localOrder, setLocalOrder] = useState<TabGroup[]>(folderGroups);

  // Reset when switching folders or when folderGroups changes
  useEffect(() => {
    setLocalOrder(folderGroups);
  }, [folderId, groups]);

  // Sync additions/deletions from outside while preserving manual order
  useEffect(() => {
    const groupMap = new Map(folderGroups.map((g) => [g.id, g]));
    const folderIds = new Set(folderGroups.map((g) => g.id));
    const kept = localOrder.filter((g) => folderIds.has(g.id)).map((g) => groupMap.get(g.id)!);
    const keptIds = new Set(kept.map((g) => g.id));
    const added = folderGroups.filter((g) => !keptIds.has(g.id));
    setLocalOrder([...kept, ...added]);
  }, [folderId, groups]);

  const handleReorder = (newOrder: TabGroup[]) => {
    setLocalOrder(newOrder);
    reorderGroups(newOrder);
  };

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
          onClick={() => navigate("/folders", { state: { fromFolderDetail: true } })}
        >
          ←
        </button>
        <span className="text-sm font-bold text-gray-900 flex-1 text-left">{title}</span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-4">
        {localOrder.length === 0 ? (
          <p className="text-center text-gray-400 text-[13px] p-5">No groups here yet.</p>
        ) : (
          <Reorder.Group as="div" axis="y" values={localOrder} onReorder={handleReorder} className="flex flex-col gap-2.5">
            {localOrder.map((g) => (
              <SortableCard
                key={g.id}
                g={g}
                folders={folders}
                onDelete={() => deleteGroup(g.id)}
                onMove={(fid) => moveGroup(g.id, fid)}
                onUpdate={(tabs) => updateGroup(g.id, tabs)}
                onRename={(newName) => renameGroup(g.id, newName)}
                onUpdateAppearance={(icon, iconColor) => updateGroupAppearance(g.id, icon, iconColor)}
                onUpdateDescription={(description) => updateGroupDescription(g.id, description)}
                onUpdateLabel={(label) => updateGroupLabel(g.id, label)}
                onCreateFolder={context.createFolder}
              />
            ))}
          </Reorder.Group>
        )}
      </div>
    </motion.div>
  );
}
