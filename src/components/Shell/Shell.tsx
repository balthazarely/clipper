import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Header } from "../Header/Header";
import { NewGroupPage } from "../../pages/NewGroupPage";
import { FolderListPage } from "../../pages/FolderListPage";
import { FolderDetailPage } from "../../pages/FolderDetailPage";
import { SettingsPage } from "../../pages/SettingsPage";
import type { Folder, TabGroup } from "../../lib/types";

export type ShellContext = {
  tabs: chrome.tabs.Tab[];
  groups: TabGroup[];
  folders: Folder[];
  saveGroup: (group: TabGroup) => void;
  createFolder: (name: string, icon?: string, iconColor?: string) => void;
  deleteFolder: (id: string) => void;
  updateFolder: (id: string, name: string) => void;
  updateFolderAppearance: (id: string, icon: string, iconColor: string) => void;
  deleteGroup: (id: string) => void;
  moveGroup: (id: string, folderId: string | undefined) => void;
  reorderGroups: (reordered: TabGroup[]) => void;
  reorderFolders: (reordered: Folder[]) => void;
  updateGroup: (id: string, tabs: import("../../lib/types").SavedTab[]) => void;
  renameGroup: (id: string, name: string) => void;
  updateGroupAppearance: (id: string, icon: string, iconColor: string) => void;
  updateGroupDescription: (id: string, description: string) => void;
  updateGroupLabel: (id: string, label: string) => void;
};

export function Shell(props: ShellContext) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ folderId?: string }>();

  const onFoldersTab = location.pathname.startsWith("/folders");
  const isFolderDetail = location.pathname.startsWith("/folders/");
  const onSettingsPage = location.pathname === "/settings";

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header onNewGroup={() => navigate("/")} />

      <LayoutGroup>
        <div role="tablist" className="flex items-center gap-4 px-3 pt-2 pb-1 border-b border-gray-200">
          <motion.button
            role="tab"
            onClick={() => navigate("/")}
            className="relative px-1 py-2 text-sm font-medium text-gray-900 bg-transparent border-none cursor-pointer"
          >
            New Group
            {!onFoldersTab && !onSettingsPage && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </motion.button>
          <motion.button
            role="tab"
            onClick={() => navigate("/folders")}
            className="relative px-1 py-2 text-sm font-medium text-gray-900 bg-transparent border-none cursor-pointer"
          >
            Folders
            {onFoldersTab && !onSettingsPage && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </motion.button>
          <div className="flex-1" />
          <motion.button
            role="tab"
            onClick={() => navigate("/settings")}
            className="relative px-1 py-2 text-sm font-medium text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
            </svg>
          </motion.button>
        </div>
      </LayoutGroup>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {location.pathname === "/" && <NewGroupPage key="new-group" context={props} />}
          {location.pathname === "/folders" && !isFolderDetail && <FolderListPage key="folders-list" context={props} location={location} />}
          {isFolderDetail && <FolderDetailPage key={`folder-${params.folderId}`} context={props} />}
          {location.pathname === "/settings" && <SettingsPage key="settings" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
