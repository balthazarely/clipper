import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { ShellContext } from "../components/Shell/Shell";
import type { TabGroup, Folder } from "../lib/types";

function getDepth(pathname: string): number {
  if (pathname.startsWith("/folders/")) return 2;
  if (pathname === "/folders") return 1;
  return 0;
}

export function NewGroupPage({ context }: { context: ShellContext }) {
  const { tabs, groups, folders, saveGroup } = context;
  const navigate = useNavigate();
  const location = useLocation();
  const prevDepthRef = useRef<number>(getDepth(location.pathname));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prevDepthRef.current = getDepth(location.pathname);
  }, [location.pathname]);

  const isReturning = getDepth(location.pathname) < prevDepthRef.current;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [folderId, setFolderId] = useState("");
  const [tabNotes, setTabNotes] = useState<Record<number, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const selectedFolder = folders.find((f) => f.id === folderId);
  const selectedFolderName = selectedFolder ? selectedFolder.name : "Ungrouped";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateFolder = () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return;
    const newFolderId = String(Date.now());
    context.createFolder(trimmedName);
    setFolderId(newFolderId);
    setNewFolderName("");
    setIsCreatingFolder(false);
    setIsDropdownOpen(false);
  };

  const [selectedTabIds, setSelectedTabIds] = useState<Set<number>>(
    new Set(tabs.filter((t) => t.url && t.title).map((t) => t.id!)),
  );

  const validTabs = tabs.filter(
    (t) => t.url && t.title && selectedTabIds.has(t.id!),
  );

  const handleRemoveTab = (tabId: number) => {
    const newSelected = new Set(selectedTabIds);
    newSelected.delete(tabId);
    setSelectedTabIds(newSelected);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const group: TabGroup = {
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      label: label.trim() || undefined,
      folderId: folderId || undefined,
      savedAt: Date.now(),
      tabs: validTabs.map((t) => ({
        title: t.title!,
        url: t.url!,
        favIconUrl: t.favIconUrl,
        note: tabNotes[t.id!]?.trim() || undefined,
      })),
    };
    saveGroup(group);
    setName("");
    setDescription("");
    setLabel("");
    setFolderId("");
    setTabNotes({});
    navigate("/folders");
  };

  return (
    <motion.div
      initial={{ x: isReturning ? "-100%" : "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col gap-2 px-3.5 pt-2 overflow-hidden"
    >
      <input
        className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500"
        placeholder="Group name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 resize-none"
        placeholder="Why are you saving these? (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <input
        className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500"
        placeholder="Label (e.g. Work, Research)..."
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 cursor-pointer text-left flex items-center justify-between"
        >
          <span>{selectedFolderName}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-48 overflow-y-auto">
            <button
              onClick={() => {
                setFolderId("");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left text-[13px] px-2.5 py-2 transition-colors ${
                folderId === ""
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-50 text-gray-900"
              }`}
            >
              Ungrouped
            </button>
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFolderId(f.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left text-[13px] px-2.5 py-2 transition-colors ${
                  folderId === f.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "hover:bg-gray-50 text-gray-900"
                }`}
              >
                {f.name}
              </button>
            ))}
            {isCreatingFolder ? (
              <div className="border-t border-gray-100 flex gap-1.5 p-2">
                <input
                  className="flex-1 text-[12px] px-2 py-1.5 rounded border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500"
                  placeholder="Folder name..."
                  value={newFolderName}
                  autoFocus
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") {
                      setIsCreatingFolder(false);
                      setNewFolderName("");
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="font-[inherit] text-[11px] font-medium px-2 py-1.5 rounded bg-gray-900 text-white cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-40"
                  disabled={!newFolderName.trim()}
                  onClick={handleCreateFolder}
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="w-full text-left text-[13px] px-2.5 py-2 transition-colors text-indigo-600 hover:bg-indigo-50 border-t border-gray-100"
              >
                + Create folder
              </button>
            )}
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg max-h-[180px] overflow-y-auto py-1">
        {validTabs.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col px-2.5 py-1.5 gap-1 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {t.favIconUrl && (
                  <img
                    src={t.favIconUrl}
                    className="w-3.5 h-3.5 shrink-0 rounded-sm"
                    alt=""
                  />
                )}
                <span className="text-xs text-gray-700 truncate">
                  {t.title}
                </span>
              </div>
              <button
                className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex items-center justify-center rounded cursor-pointer"
                onClick={() => handleRemoveTab(t.id!)}
              >
                <span className="text-lg leading-none w-5 h-5 flex items-center justify-center">
                  ×
                </span>
              </button>
            </div>
            <input
              className="text-[11px] text-gray-500 bg-transparent border-0 border-b border-dashed border-gray-200 outline-none py-0.5 w-full placeholder:text-gray-300 focus:border-gray-400"
              placeholder="Add a note... (optional)"
              value={tabNotes[t.id!] ?? ""}
              onChange={(e) =>
                setTabNotes((prev) => ({ ...prev, [t.id!]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
      <button
        className="w-full font-[inherit] text-[13px] font-medium py-2.5 px-2.5 rounded-md border-none cursor-pointer transition-opacity hover:opacity-80 bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!name.trim()}
        onClick={handleSave}
      >
        Save {validTabs.length} tabs
      </button>
    </motion.div>
  );
}
