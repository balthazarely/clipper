import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { GROUP_ICONS } from "../../lib/constants";
import { dotColor } from "../../lib/utils";
import type { Folder, TabGroup } from "../../lib/types";

type SearchGroupsModalProps = {
  isOpen: boolean;
  groups: TabGroup[];
  folders: Folder[];
  searchQuery: string;
  onQueryChange: (query: string) => void;
  onSelectGroup: (group: TabGroup) => void;
  onClose: () => void;
};

export function SearchGroupsModal({
  isOpen,
  groups,
  folders,
  searchQuery,
  onQueryChange,
  onSelectGroup,
  onClose,
}: SearchGroupsModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filteredGroups = groups.filter((group) => {
    const query = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query)
    );
  });

  const getFolderName = (folderId?: string) => {
    if (!folderId) return "Ungrouped";
    return folders.find((f) => f.id === folderId)?.name || "Folder";
  };

  const getGroupColor = (group: TabGroup) => {
    return group.iconColor ?? dotColor(group.id);
  };

  const getGroupIcon = (group: TabGroup) => {
    const iconDef = GROUP_ICONS.find((i) => i.id === group.icon) ?? GROUP_ICONS[0];
    return iconDef.icon;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 w-full max-w-sm mx-4 max-h-[80vh] flex flex-col"
          >
            <div className="p-5 border-b border-gray-100">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                }}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none bg-white text-gray-900 focus:border-indigo-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredGroups.length === 0 ? (
                <div className="flex items-center justify-center h-full p-6 text-center">
                  <p className="text-sm text-gray-400">
                    {searchQuery ? "No groups found." : "Start typing to search..."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredGroups.map((group) => {
                    const IconComponent = getGroupIcon(group);
                    const color = getGroupColor(group);
                    const folderName = getFolderName(group.folderId);

                    return (
                      <button
                        key={group.id}
                        onClick={() => onSelectGroup(group)}
                        className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer flex items-start gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: color + "18" }}
                        >
                          <IconComponent size={16} color={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {folderName}
                          </p>
                          {group.description && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
