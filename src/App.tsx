import { useEffect, useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell/Shell";
import type { Folder, Label, TabGroup } from "./lib/types";
import "./App.css";

function refreshTabs(setTabs: (tabs: chrome.tabs.Tab[]) => void) {
  chrome.tabs.query({ currentWindow: true }, setTabs);
}

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [groups, setGroups] = useState<TabGroup[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    refreshTabs(setTabs);
    chrome.storage.local.get(["tabGroups", "folders", "labels"], (result) => {
      setGroups((result.tabGroups as TabGroup[]) || []);
      setFolders((result.folders as Folder[]) || []);
      setLabels((result.labels as Label[]) || []);
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
    setGroups((prev) => {
      const updated = [group, ...prev];
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const moveGroup = (id: string, folderId: string | undefined) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, folderId } : g));
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const createFolder = (name: string, icon?: string, iconColor?: string) => {
    const folder: Folder = { id: String(Date.now()), name, icon, iconColor };
    setFolders((prev) => {
      const updated = [...prev, folder];
      chrome.storage.local.set({ folders: updated });
      return updated;
    });
  };

  const deleteFolder = (id: string) => {
    setFolders((prevFolders) => {
      const updatedFolders = prevFolders.filter((f) => f.id !== id);
      setGroups((prevGroups) => {
        const updatedGroups = prevGroups.map((g) => (g.folderId === id ? { ...g, folderId: undefined } : g));
        chrome.storage.local.set({ folders: updatedFolders, tabGroups: updatedGroups });
        return updatedGroups;
      });
      return updatedFolders;
    });
  };

  const updateFolder = (id: string, name: string) => {
    setFolders((prevFolders) => {
      const updated = prevFolders.map((f) => (f.id === id ? { ...f, name } : f));
      chrome.storage.local.set({ folders: updated });
      return updated;
    });
  };

  const updateFolderAppearance = (id: string, icon: string, iconColor: string) => {
    setFolders((prevFolders) => {
      const updated = prevFolders.map((f) => (f.id === id ? { ...f, icon, iconColor } : f));
      chrome.storage.local.set({ folders: updated });
      return updated;
    });
  };

  const updateGroup = (id: string, tabs: import("./lib/types").SavedTab[]) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, tabs } : g));
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const renameGroup = (id: string, name: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, name } : g));
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const updateGroupAppearance = (id: string, icon: string, iconColor: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, icon, iconColor } : g));
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const updateGroupDescription = (id: string, description: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, description } : g));
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const updateGroupLabel = (id: string, label: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, label } : g));
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const createLabel = (name: string, color?: string) => {
    const label: Label = { id: String(Date.now()), name, color };
    setLabels((prev) => {
      const updated = [...prev, label];
      chrome.storage.local.set({ labels: updated });
      return updated;
    });
  };

  const updateLabel = (id: string, name: string, color?: string) => {
    setLabels((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, name, color } : l));
      chrome.storage.local.set({ labels: updated });
      return updated;
    });
  };

  const deleteLabel = (id: string) => {
    setLabels((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      chrome.storage.local.set({ labels: updated });
      return updated;
    });
  };

  const reorderGroups = (reordered: TabGroup[]) => {
    setGroups((prev) => {
      const ids = new Set(reordered.map((g) => g.id));
      const indices: number[] = [];
      prev.forEach((g, i) => {
        if (ids.has(g.id)) indices.push(i);
      });
      const updated = [...prev];
      indices.forEach((idx, i) => {
        updated[idx] = reordered[i];
      });
      chrome.storage.local.set({ tabGroups: updated });
      return updated;
    });
  };

  const reorderFolders = (reordered: Folder[]) => {
    setFolders((prev) => {
      const ids = new Set(reordered.map((f) => f.id));
      const indices: number[] = [];
      prev.forEach((f, i) => {
        if (ids.has(f.id)) indices.push(i);
      });
      const updated = [...prev];
      indices.forEach((idx, i) => {
        updated[idx] = reordered[i];
      });
      chrome.storage.local.set({ folders: updated });
      return updated;
    });
  };

  const context = {
    tabs,
    groups,
    folders,
    labels,
    saveGroup,
    createFolder,
    deleteFolder,
    updateFolder,
    deleteGroup,
    moveGroup,
    reorderGroups,
    reorderFolders,
    updateGroup,
    renameGroup,
    updateGroupAppearance,
    updateGroupDescription,
    updateGroupLabel,
    updateFolderAppearance,
    createLabel,
    updateLabel,
    deleteLabel,
  };

  return (
    <MemoryRouter>
      <Routes>
        <Route element={<Shell {...context} />}>
          <Route path="/" element={null} />
          <Route path="/folders" element={null} />
          <Route path="/folders/:folderId" element={null} />
          <Route path="/settings" element={null} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
