import { useEffect, useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell/Shell";
import { NewGroupPage } from "./pages/NewGroupPage";
import { FolderListPage } from "./pages/FolderListPage";
import { FolderDetailPage } from "./pages/FolderDetailPage";
import type { Folder, TabGroup } from "./lib/types";
import "./App.css";

function refreshTabs(setTabs: (tabs: chrome.tabs.Tab[]) => void) {
  chrome.tabs.query({ currentWindow: true }, setTabs);
}

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [groups, setGroups] = useState<TabGroup[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    refreshTabs(setTabs);
    chrome.storage.local.get(["tabGroups", "folders"], (result) => {
      setGroups((result.tabGroups as TabGroup[]) || []);
      setFolders((result.folders as Folder[]) || []);
    });
    const onChanged = () => refreshTabs(setTabs);
    chrome.tabs.onCreated.addListener(onChanged);
    chrome.tabs.onRemoved.addListener(onChanged);
    chrome.tabs.onUpdated.addListener(onChanged);
    return () => {
      chrome.tabs.onCreated.removeListener(onChanged);
      chrome.tabs.onRemoved.removeListener(onChanged);
      chrome.tabs.onUpdated.removeListener(onChanged);
    };
  }, []);

  const saveGroup = (group: TabGroup) => {
    const updated = [group, ...groups];
    setGroups(updated);
    chrome.storage.local.set({ tabGroups: updated });
  };

  const deleteGroup = (id: string) => {
    const updated = groups.filter((g) => g.id !== id);
    setGroups(updated);
    chrome.storage.local.set({ tabGroups: updated });
  };

  const moveGroup = (id: string, folderId: string | undefined) => {
    const updated = groups.map((g) => (g.id === id ? { ...g, folderId } : g));
    setGroups(updated);
    chrome.storage.local.set({ tabGroups: updated });
  };

  const createFolder = (name: string) => {
    const folder: Folder = { id: String(Date.now()), name };
    const updated = [...folders, folder];
    setFolders(updated);
    chrome.storage.local.set({ folders: updated });
  };

  const deleteFolder = (id: string) => {
    const updatedFolders = folders.filter((f) => f.id !== id);
    const updatedGroups = groups.map((g) =>
      g.folderId === id ? { ...g, folderId: undefined } : g,
    );
    setFolders(updatedFolders);
    setGroups(updatedGroups);
    chrome.storage.local.set({ folders: updatedFolders, tabGroups: updatedGroups });
  };

  const updateFolder = (id: string, name: string) => {
    const updated = folders.map((f) => (f.id === id ? { ...f, name } : f));
    setFolders(updated);
    chrome.storage.local.set({ folders: updated });
  };

  const updateGroup = (id: string, tabs: import("./lib/types").SavedTab[]) => {
    const updated = groups.map((g) => (g.id === id ? { ...g, tabs } : g));
    setGroups(updated);
    chrome.storage.local.set({ tabGroups: updated });
  };

  const renameGroup = (id: string, name: string) => {
    const updated = groups.map((g) => (g.id === id ? { ...g, name } : g));
    setGroups(updated);
    chrome.storage.local.set({ tabGroups: updated });
  };

  const reorderGroups = (reordered: TabGroup[]) => {
    const ids = new Set(reordered.map((g) => g.id));
    const indices: number[] = [];
    groups.forEach((g, i) => { if (ids.has(g.id)) indices.push(i); });
    const updated = [...groups];
    indices.forEach((idx, i) => { updated[idx] = reordered[i]; });
    setGroups(updated);
    chrome.storage.local.set({ tabGroups: updated });
  };

  const reorderFolders = (reordered: Folder[]) => {
    const ids = new Set(reordered.map((f) => f.id));
    const indices: number[] = [];
    folders.forEach((f, i) => { if (ids.has(f.id)) indices.push(i); });
    const updated = [...folders];
    indices.forEach((idx, i) => { updated[idx] = reordered[i]; });
    setFolders(updated);
    chrome.storage.local.set({ folders: updated });
  };

  const context = { tabs, groups, folders, saveGroup, createFolder, deleteFolder, updateFolder, deleteGroup, moveGroup, reorderGroups, reorderFolders, updateGroup, renameGroup };

  return (
    <MemoryRouter>
      <Routes>
        <Route element={<Shell {...context} />}>
          <Route index element={<NewGroupPage />} />
          <Route path="folders" element={<FolderListPage />} />
          <Route path="folders/:folderId" element={<FolderDetailPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
