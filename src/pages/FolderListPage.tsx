import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import type { Location } from "react-router-dom";
import { FolderCard } from "../components/FolderCard/FolderCard";
import { SortableFolder } from "../components/SortableFolder/SortableFolder";
import type { ShellContext } from "../components/Shell/Shell";
import type { Folder } from "../lib/types";
import { ROUTE_TRANSITION, GROUP_ICONS, DOT_COLORS } from "../lib/constants";
import { getDepth } from "../lib/utils";

export function FolderListPage({ context, location }: { context: ShellContext; location: Location }) {
  const { folders, groups, createFolder, reorderFolders, deleteFolder, updateFolder, updateFolderAppearance } = context;
  const navigate = useNavigate();
  const fromFolderDetail = Boolean((location.state as { fromFolderDetail?: boolean } | null)?.fromFolderDetail);
  const [isNavigatingToDetail, setIsNavigatingToDetail] = useState(false);
  const prevDepthRef = useRef<number>(getDepth(location.pathname));
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const currentDepth = getDepth(location.pathname);
    // If we were deeper before and now we're at folders level, we're coming back
    if (prevDepthRef.current > currentDepth) {
      setIsReturning(true);
    } else {
      setIsReturning(false);
    }
    prevDepthRef.current = currentDepth;
  }, [location.pathname]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createIcon, setCreateIcon] = useState(GROUP_ICONS[0].id);
  const [createColor, setCreateColor] = useState(DOT_COLORS[0]);
  const [localOrder, setLocalOrder] = useState<Folder[]>(folders);

  useEffect(() => {
    setLocalOrder(folders);
  }, [folders]);

  const ungroupedCount = groups.filter((g) => !g.folderId).length;
  const showUngrouped = ungroupedCount > 0;

  const submitFolder = () => {
    const n = createName.trim();
    if (!n) return;
    createFolder(n, createIcon, createColor);
    setCreateName("");
    setCreateIcon(GROUP_ICONS[0].id);
    setCreateColor(DOT_COLORS[0]);
    setShowCreateModal(false);
  };

  const handleReorder = (newOrder: Folder[]) => {
    setLocalOrder(newOrder);
    reorderFolders(newOrder);
  };

  const openFolderDetail = (id: string) => {
    setIsNavigatingToDetail(true);
    navigate(`/folders/${id}`);
  };

  return (
    <motion.div
      initial={{ x: fromFolderDetail || isReturning ? "-100%" : "100%" }}
      animate={{ x: 0 }}
      exit={{ x: isNavigatingToDetail ? "-100%" : "100%" }}
      transition={ROUTE_TRANSITION}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
    >
      <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2 flex-1 overflow-y-auto">
        {showUngrouped && (
          <FolderCard id="ungrouped" name="Ungrouped" count={ungroupedCount} onClick={() => openFolderDetail("ungrouped")} />
        )}

        {localOrder.length === 0 && !showCreateModal ? (
          <p className="text-center text-gray-400 text-[13px] p-5">No folders yet. Create one below.</p>
        ) : (
          <Reorder.Group as="div" axis="y" values={localOrder} onReorder={handleReorder} className="flex flex-col gap-2.5">
            {localOrder.map((f) => {
              const count = groups.filter((g) => g.folderId === f.id).length;
              return (
                <SortableFolder
                  key={f.id}
                  folder={f}
                  count={count}
                  onNavigate={() => openFolderDetail(f.id)}
                  onRename={(name) => updateFolder(f.id, name)}
                  onDelete={() => deleteFolder(f.id)}
                  onUpdateAppearance={(icon, iconColor) => updateFolderAppearance(f.id, icon, iconColor)}
                />
              );
            })}
          </Reorder.Group>
        )}

        <button
          className="text-[13px] text-indigo-600 bg-transparent border border-dashed border-indigo-200 rounded-xl px-3.5 py-3 cursor-pointer text-left transition-colors hover:bg-indigo-50 font-[inherit]"
          onClick={() => {
            setCreateName("");
            setCreateIcon(GROUP_ICONS[0].id);
            setCreateColor(DOT_COLORS[0]);
            setShowCreateModal(true);
          }}
        >
          + New folder
        </button>
      </div>

      {/* Create folder modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -16 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-xs mx-4 p-5"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-4">New folder</h3>

              {/* Preview */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: createColor + "20" }}>
                  {(() => {
                    const PreviewIcon = (GROUP_ICONS.find((i) => i.id === createIcon) ?? GROUP_ICONS[0]).icon;
                    return <PreviewIcon size={20} color={createColor} />;
                  })()}
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-1.5">Name</p>
              <input
                className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                placeholder="Folder name..."
                value={createName}
                autoFocus
                onChange={(e) => setCreateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitFolder();
                  if (e.key === "Escape") setShowCreateModal(false);
                }}
              />

              <p className="text-xs text-gray-400 mb-2">Color</p>
              <div className="flex gap-2 mb-4">
                {DOT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCreateColor(c)}
                    className="w-6 h-6 rounded-full shrink-0 cursor-pointer transition-transform hover:scale-110"
                    style={{ background: c, outline: createColor === c ? `2px solid ${c}` : "2px solid transparent", outlineOffset: "2px" }}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-2">Icon</p>
              <div className="grid grid-cols-4 gap-1 mb-5">
                {GROUP_ICONS.map((ic) => {
                  const IconOption = ic.icon;
                  return (
                    <button
                      key={ic.id}
                      onClick={() => setCreateIcon(ic.id)}
                      className="flex items-center justify-center h-10 rounded-lg cursor-pointer transition-colors"
                      style={{ background: createIcon === ic.id ? createColor + "18" : undefined }}
                      title={ic.label}
                    >
                      <IconOption size={16} color={createIcon === ic.id ? createColor : "#9ca3af"} />
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:opacity-80 transition-opacity border-none cursor-pointer disabled:opacity-40"
                  disabled={!createName.trim()}
                  onClick={submitFolder}
                >
                  Create
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
