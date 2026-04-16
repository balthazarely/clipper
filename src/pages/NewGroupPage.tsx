import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { ShellContext } from "../components/Shell/Shell";
import type { TabGroup } from "../lib/types";
import { ROUTE_TRANSITION, GROUP_ICONS, DOT_COLORS } from "../lib/constants";
import { getDepth } from "../lib/utils";

export function NewGroupPage({ context }: { context: ShellContext }) {
  const { tabs, folders, saveGroup } = context;
  const navigate = useNavigate();
  const location = useLocation();
  const prevDepthRef = useRef<number>(getDepth(location.pathname));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconPickerRef = useRef<HTMLDivElement>(null);

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
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(GROUP_ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(DOT_COLORS[0]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderModalName, setFolderModalName] = useState("");
  const [folderModalIcon, setFolderModalIcon] = useState(GROUP_ICONS[0].id);
  const [folderModalColor, setFolderModalColor] = useState(DOT_COLORS[0]);

  const selectedFolder = folders.find((f) => f.id === folderId);
  const selectedFolderName = selectedFolder ? selectedFolder.name : "Ungrouped";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (iconPickerRef.current && !iconPickerRef.current.contains(e.target as Node)) {
        setIsIconPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateFolder = () => {
    const trimmedName = folderModalName.trim();
    if (!trimmedName) return;
    const newFolderId = String(Date.now());
    context.createFolder(trimmedName, folderModalIcon, folderModalColor);
    setFolderId(newFolderId);
    setFolderModalName("");
    setFolderModalIcon(GROUP_ICONS[0].id);
    setFolderModalColor(DOT_COLORS[0]);
    setShowFolderModal(false);
    setIsDropdownOpen(false);
  };

  const [selectedTabIds, setSelectedTabIds] = useState<Set<number>>(new Set(tabs.filter((t) => t.url && t.title).map((t) => t.id!)));

  // Sync selectedTabIds when tabs change (e.g. new tab opened/closed)
  useEffect(() => {
    const validTabIds = new Set(tabs.filter((t) => t.url && t.title).map((t) => t.id!));
    setSelectedTabIds((prev) => {
      // Keep selected tabs that still exist, add any new tabs
      const updated = new Set<number>();
      validTabIds.forEach((id) => {
        if (prev.has(id)) updated.add(id);
      });
      validTabIds.forEach((id) => {
        if (!prev.has(id)) updated.add(id);
      });
      return updated;
    });
  }, [tabs]);

  const validTabs = tabs.filter((t) => t.url && t.title && selectedTabIds.has(t.id!));

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
      icon: selectedIcon,
      iconColor: selectedColor,
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
    setSelectedIcon(GROUP_ICONS[0].id);
    setSelectedColor(DOT_COLORS[0]);
    navigate("/folders");
  };

  return (
    <>
      <motion.div
        initial={{ x: isReturning ? "100%" : "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={ROUTE_TRANSITION}
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
        <div className="flex gap-2 items-stretch">
          {/* Icon + color picker */}
          <div className="relative shrink-0" ref={iconPickerRef}>
            <button
              onClick={() => setIsIconPickerOpen((v) => !v)}
              className="h-full min-h-[34px] aspect-square flex items-center justify-center rounded-lg border border-gray-200 cursor-pointer transition-colors hover:border-gray-300"
              style={{ background: selectedColor + "18" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={selectedColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: GROUP_ICONS.find((i) => i.id === selectedIcon)?.svg ?? GROUP_ICONS[0].svg }}
              />
            </button>
            {isIconPickerOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 p-2 w-52">
                {/* Color swatches */}
                <div className="flex gap-1.5 mb-2.5">
                  {DOT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className="w-5 h-5 rounded-full shrink-0 cursor-pointer transition-transform hover:scale-110"
                      style={{
                        background: c,
                        outline: selectedColor === c ? `2px solid ${c}` : "2px solid transparent",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
                {/* Icon grid */}
                <div className="grid grid-cols-4 gap-1">
                  {GROUP_ICONS.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => setSelectedIcon(icon.id)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-colors"
                      style={{
                        background: selectedIcon === icon.id ? selectedColor + "18" : undefined,
                      }}
                      title={icon.label}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selectedIcon === icon.id ? selectedColor : "#9ca3af"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Folder dropdown */}
          <div className="relative flex-1" ref={dropdownRef}>
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
                    folderId === "" ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50 text-gray-900"
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
                      folderId === f.id ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setFolderModalName("");
                    setFolderModalIcon(GROUP_ICONS[0].id);
                    setFolderModalColor(DOT_COLORS[0]);
                    setIsDropdownOpen(false);
                    setShowFolderModal(true);
                  }}
                  className="w-full text-left text-[13px] px-2.5 py-2 transition-colors text-indigo-600 hover:bg-indigo-50 border-t border-gray-100"
                >
                  + Create folder
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg max-h-[180px] overflow-y-auto py-1">
          {validTabs.map((t) => (
            <div
              key={t.id}
              className="group flex flex-col px-2.5 py-1.5 gap-1 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {t.favIconUrl && <img src={t.favIconUrl} className="w-3.5 h-3.5 shrink-0 rounded-sm" alt="" />}
                  <span className="text-xs text-gray-700 truncate">{t.title}</span>
                </div>
                <button
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all flex items-center justify-center rounded cursor-pointer"
                  onClick={() => handleRemoveTab(t.id!)}
                >
                  <span className="text-lg leading-none w-5 h-5 flex items-center justify-center">×</span>
                </button>
              </div>
              <input
                className="text-[11px] text-gray-500 bg-transparent border-0 border-b border-dashed border-gray-200 outline-none py-0.5 w-full placeholder:text-gray-300 focus:border-gray-400"
                placeholder="Add a note... (optional)"
                value={tabNotes[t.id!] ?? ""}
                onChange={(e) => setTabNotes((prev) => ({ ...prev, [t.id!]: e.target.value }))}
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

      {/* Create folder modal */}
      <AnimatePresence>
        {showFolderModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFolderModal(false)}
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
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: folderModalColor + "20" }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={folderModalColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: GROUP_ICONS.find((i) => i.id === folderModalIcon)?.svg ?? GROUP_ICONS[0].svg }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-1.5">Name</p>
              <input
                className="w-full text-[13px] px-2.5 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500 mb-4"
                placeholder="Folder name..."
                value={folderModalName}
                autoFocus
                onChange={(e) => setFolderModalName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") setShowFolderModal(false);
                }}
              />

              <p className="text-xs text-gray-400 mb-2">Color</p>
              <div className="flex gap-2 mb-4">
                {DOT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFolderModalColor(c)}
                    className="w-6 h-6 rounded-full shrink-0 cursor-pointer transition-transform hover:scale-110"
                    style={{
                      background: c,
                      outline: folderModalColor === c ? `2px solid ${c}` : "2px solid transparent",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-2">Icon</p>
              <div className="grid grid-cols-4 gap-1 mb-5">
                {GROUP_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    onClick={() => setFolderModalIcon(ic.id)}
                    className="flex items-center justify-center h-10 rounded-lg cursor-pointer transition-colors"
                    style={{ background: folderModalIcon === ic.id ? folderModalColor + "18" : undefined }}
                    title={ic.label}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={folderModalIcon === ic.id ? folderModalColor : "#9ca3af"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dangerouslySetInnerHTML={{ __html: ic.svg }}
                    />
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:opacity-80 transition-opacity border-none cursor-pointer disabled:opacity-40"
                  disabled={!folderModalName.trim()}
                  onClick={handleCreateFolder}
                >
                  Create
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                  onClick={() => setShowFolderModal(false)}
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
