import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Reorder, useDragControls } from "framer-motion";
import type { Location } from "react-router-dom";
import { FolderCard } from "../components/FolderCard/FolderCard";
import type { ShellContext } from "../components/Shell/Shell";
import type { Folder } from "../lib/types";

function SortableFolder({
  folder,
  count,
  onNavigate,
}: {
  folder: Folder;
  count: number;
  onNavigate: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={folder.id}
      value={folder}
      as="div"
      className="flex-1 min-w-0"
    >
      <FolderCard
        id={folder.id}
        name={folder.name}
        count={count}
        onClick={onNavigate}
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

export function FolderListPage({
  context,
  location,
}: {
  context: ShellContext;
  location: Location;
}) {
  const { folders, groups, createFolder, reorderFolders } = context;
  const navigate = useNavigate();
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

  const [search, setSearch] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [localOrder, setLocalOrder] = useState<Folder[]>(folders);

  useEffect(() => {
    setLocalOrder(folders);
  }, [folders]);

  const ungroupedCount = groups.filter((g) => !g.folderId).length;
  const filteredFolders = search
    ? folders.filter(
        (f) => !search || f.name.toLowerCase().includes(search.toLowerCase()),
      )
    : localOrder;
  const showUngrouped =
    ungroupedCount > 0 &&
    (!search || "ungrouped".includes(search.toLowerCase()));

  const submitFolder = () => {
    const n = newFolderName.trim();
    if (!n) return;
    createFolder(n);
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleReorder = (newOrder: Folder[]) => {
    setLocalOrder(newOrder);
    reorderFolders(newOrder);
  };

  return (
    <motion.div
      initial={{ x: isReturning ? "100%" : "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
    >
      {/* <div className="flex items-center gap-2 mx-3 mt-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder:text-gray-400"
          placeholder="Search folders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div> */}

      <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2">
        {showUngrouped && (
          <FolderCard
            id="ungrouped"
            name="Ungrouped"
            count={ungroupedCount}
            onClick={() => navigate("/folders/ungrouped")}
          />
        )}

        {filteredFolders.length === 0 && !showNewFolder ? (
          <p className="text-center text-gray-400 text-[13px] p-5">
            No folders yet. Create one below.
          </p>
        ) : search ? (
          <div className="flex flex-col gap-2.5">
            {filteredFolders.map((f) => {
              const count = groups.filter((g) => g.folderId === f.id).length;
              return (
                <FolderCard
                  key={f.id}
                  id={f.id}
                  name={f.name}
                  count={count}
                  onClick={() => navigate(`/folders/${f.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <Reorder.Group
            as="div"
            axis="y"
            values={localOrder}
            onReorder={handleReorder}
            className="flex flex-col gap-2.5"
          >
            {localOrder.map((f) => {
              const count = groups.filter((g) => g.folderId === f.id).length;
              return (
                <SortableFolder
                  key={f.id}
                  folder={f}
                  count={count}
                  onNavigate={() => navigate(`/folders/${f.id}`)}
                />
              );
            })}
          </Reorder.Group>
        )}

        {showNewFolder ? (
          <div className="flex gap-2">
            <input
              className="flex-1 text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500"
              placeholder="Folder name..."
              value={newFolderName}
              autoFocus
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitFolder();
                if (e.key === "Escape") setShowNewFolder(false);
              }}
            />
            <button
              className="font-[inherit] text-xs font-medium px-2.5 py-1.5 rounded-md border-none cursor-pointer transition-opacity hover:opacity-80 bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={submitFolder}
              disabled={!newFolderName.trim()}
            >
              Create
            </button>
            <button
              className="font-[inherit] text-xs font-medium px-2.5 py-1.5 rounded-md border-none cursor-pointer transition-opacity hover:opacity-80 bg-gray-200 text-gray-600"
              onClick={() => setShowNewFolder(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="text-[13px] text-indigo-600 bg-transparent border border-dashed border-indigo-200 rounded-xl px-3.5 py-3 cursor-pointer text-left transition-colors hover:bg-indigo-50 font-[inherit]"
            onClick={() => setShowNewFolder(true)}
          >
            + New folder
          </button>
        )}
      </div>
    </motion.div>
  );
}
