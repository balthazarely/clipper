import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Header } from "../Header/Header";
import { NewGroupPage } from "../../pages/NewGroupPage";
import { FolderListPage } from "../../pages/FolderListPage";
import { FolderDetailPage } from "../../pages/FolderDetailPage";
import { SettingsPage } from "../../pages/SettingsPage";
import type { Folder, Label, TabGroup } from "../../lib/types";

export type ShellContext = {
  tabs: chrome.tabs.Tab[];
  groups: TabGroup[];
  folders: Folder[];
  labels: Label[];
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
  createLabel: (name: string, color?: string) => void;
  updateLabel: (id: string, name: string, color?: string) => void;
  deleteLabel: (id: string) => void;
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
      <Header onNewGroup={() => navigate("/")} onSettings={() => navigate("/settings")} />

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
        </div>
      </LayoutGroup>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {location.pathname === "/" && <NewGroupPage key="new-group" context={props} />}
          {location.pathname === "/folders" && !isFolderDetail && <FolderListPage key="folders-list" context={props} location={location} />}
          {isFolderDetail && <FolderDetailPage key={`folder-${params.folderId}`} context={props} />}
          {location.pathname === "/settings" && <SettingsPage key="settings" context={props} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
