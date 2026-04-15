import { useEffect, useRef, useState } from "react";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Reorder } from "framer-motion";
import "./App.css";

type Clip = {
  text: string;
  url: string;
  thumbnail?: string;
  timestamp: number;
  folderId?: string;
};
type Folder = { id: string; name: string };

function ClipCard({
  clip,
  onDelete,
  onDragStart,
}: {
  clip: Clip;
  onDelete: () => void;
  onDragStart?: () => void;
}) {
  return (
    <Reorder.Item
      as="div"
      value={clip}
      className="clip-card"
      onDragStart={onDragStart}
      transition={{ type: "spring", stiffness: 600, damping: 40, mass: 0.5 }}
    >
      <div className="clip-card-body">
        <div className="drag-handle">⠿</div>
        <div className="clip-body-content">
          {clip.thumbnail && (
            <img className="clip-thumbnail" src={clip.thumbnail} alt="" />
          )}
          <div className="clip-content">
            <p className="clip-source">{new URL(clip.url).hostname}</p>
            <p className="clip-text">{clip.text}</p>
          </div>
        </div>
      </div>
      <div className="clip-actions" onPointerDown={(e) => e.stopPropagation()}>
        <button
          className="btn btn-source"
          onClick={() => chrome.tabs.create({ url: clip.url })}
        >
          View Source
        </button>
        <button className="btn btn-delete" onClick={onDelete}>
          Delete Clip
        </button>
      </div>
    </Reorder.Item>
  );
}

// Shared state passed via context-style props to avoid prop drilling through router
type AppState = {
  clips: Clip[];
  setClips: React.Dispatch<React.SetStateAction<Clip[]>>;
  folders: Folder[];
  pending: Clip | null;
  draggingClipRef: React.RefObject<Clip | null>;
  dragOver: string | null;
  setDragOver: React.Dispatch<React.SetStateAction<string | null>>;
};

function MainView({
  clips,
  setClips,
  folders,
  pending,
  draggingClipRef,
  dragOver,
  setDragOver,
}: AppState) {
  const navigate = useNavigate();
  const [newFolderName, setNewFolderName] = useState("");

  const acceptClip = () => {
    if (!pending) return;
    chrome.storage.local.set({ clips: [pending, ...clips], pendingClip: null });
  };

  const dismissClip = () => {
    chrome.storage.local.set({ pendingClip: null });
  };

  const deleteClip = (timestamp: number) => {
    chrome.storage.local.set({
      clips: clips.filter((c) => c.timestamp !== timestamp),
    });
  };

  const handleReorder = (reordered: Clip[]) => {
    const folderClips = clips.filter((c) => c.folderId);
    const merged = [...reordered, ...folderClips];
    setClips(merged);
    chrome.storage.local.set({ clips: merged });
  };

  const createFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const folder: Folder = { id: String(Date.now()), name };
    chrome.storage.local.set({ folders: [...folders, folder] });
    setNewFolderName("");
  };

  const deleteFolder = (id: string) => {
    chrome.storage.local.set({
      folders: folders.filter((f) => f.id !== id),
      clips: clips.map((c) =>
        c.folderId === id ? { ...c, folderId: undefined } : c,
      ),
    });
  };

  const handleDrop = (folderId: string, e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (data === "pending" && pending) {
      chrome.storage.local.set({
        clips: [{ ...pending, folderId }, ...clips],
        pendingClip: null,
      });
    } else {
      const timestamp = Number(data);
      chrome.storage.local.set({
        clips: clips.map((c) =>
          c.timestamp === timestamp ? { ...c, folderId } : c,
        ),
      });
    }
    setDragOver(null);
  };

  const unassignedClips = clips.filter((c) => !c.folderId);

  return (
    <div className="panel">
      <div className="panel-header">Clipper</div>

      {pending && (
        <div
          className="pending-card"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", "pending")}
        >
          <span className="pending-label">
            New Clip — drag to a folder or save below
          </span>
          <div className="clip-card-body">
            {pending.thumbnail && (
              <img className="clip-thumbnail" src={pending.thumbnail} alt="" />
            )}
            <div className="clip-content">
              <p className="clip-source">{new URL(pending.url).hostname}</p>
              <p className="clip-text">{pending.text}</p>
            </div>
          </div>
          <div className="clip-actions">
            <button className="btn btn-accept" onClick={acceptClip}>
              Save
            </button>
            <button className="btn btn-dismiss" onClick={dismissClip}>
              Dismiss
            </button>
            <button
              className="btn btn-source"
              onClick={() => chrome.tabs.create({ url: pending.url })}
            >
              View Source
            </button>
          </div>
        </div>
      )}

      <div className="clips-list">
        {unassignedClips.length === 0 && !pending && (
          <p className="empty">No clips yet.</p>
        )}
        <Reorder.Group
          as="div"
          axis="y"
          values={unassignedClips}
          onReorder={handleReorder}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {unassignedClips.map((clip) => (
            <ClipCard
              key={clip.timestamp}
              clip={clip}
              onDelete={() => deleteClip(clip.timestamp)}
              onDragStart={() => {
                draggingClipRef.current = clip;
              }}
            />
          ))}
        </Reorder.Group>
      </div>

      <div className="folders-section">
        <div className="folders-header">
          <span className="folders-title">Folders</span>
          <div className="new-folder">
            <input
              className="folder-input"
              placeholder="New folder..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createFolder()}
            />
            <button className="btn btn-accept" onClick={createFolder}>
              +
            </button>
          </div>
        </div>

        {folders.length === 0 && (
          <p className="empty" style={{ marginTop: 8 }}>
            No folders yet.
          </p>
        )}

        <div className="folders-grid">
          {folders.map((f) => {
            const folderClips = clips.filter((c) => c.folderId === f.id);
            return (
              <div key={f.id} className="folder-wrap">
                <div
                  className={`folder-card ${dragOver === f.id ? "drag-over" : ""}`}
                  data-folder-id={f.id}
                  onClick={() => navigate(`/folder/${f.id}`)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(f.id);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(f.id, e)}
                >
                  <span className="folder-icon">📁</span>
                  <span className="folder-name">{f.name}</span>
                  <span className="folder-count">{folderClips.length}</span>
                  <button
                    className="folder-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(f.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FolderView({ clips, setClips, folders, draggingClipRef }: AppState) {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const folder = folders.find((f) => f.id === folderId);
  const folderClips = clips.filter((c) => c.folderId === folderId);

  const deleteClip = (timestamp: number) => {
    chrome.storage.local.set({
      clips: clips.filter((c) => c.timestamp !== timestamp),
    });
  };

  const handleReorder = (reordered: Clip[]) => {
    const otherClips = clips.filter((c) => c.folderId !== folderId);
    const merged = [...otherClips, ...reordered];
    setClips(merged);
    chrome.storage.local.set({ clips: merged });
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ←
        </button>
        <span>{folder?.name ?? "Folder"}</span>
      </div>
      <div className="clips-list">
        {folderClips.length === 0 && (
          <p className="empty">No clips in this folder.</p>
        )}
        <Reorder.Group
          as="div"
          axis="y"
          values={folderClips}
          onReorder={handleReorder}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {folderClips.map((clip) => (
            <ClipCard
              key={clip.timestamp}
              clip={clip}
              onDelete={() => deleteClip(clip.timestamp)}
              onDragStart={() => {
                draggingClipRef.current = clip;
              }}
            />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

function App() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pending, setPending] = useState<Clip | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const draggingClipRef = useRef<Clip | null>(null);

  useEffect(() => {
    chrome.storage.local.get(["clips", "pendingClip", "folders"], (result) => {
      setClips((result.clips as Clip[]) || []);
      setFolders((result.folders as Folder[]) || []);
      setPending((result.pendingClip as Clip) || null);
    });

    const listener = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.clips) setClips((changes.clips.newValue as Clip[]) || []);
      if (changes.folders)
        setFolders((changes.folders.newValue as Folder[]) || []);
      if (changes.pendingClip)
        setPending((changes.pendingClip.newValue as Clip) || null);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  useEffect(() => {
    const getFolderAtPoint = (x: number, y: number) => {
      const els = document.elementsFromPoint(x, y);
      return els
        .find((el) => el.closest("[data-folder-id]"))
        ?.closest("[data-folder-id]") as HTMLElement | null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingClipRef.current) return;
      const folderCard = getFolderAtPoint(e.clientX, e.clientY);
      setDragOver(folderCard?.getAttribute("data-folder-id") ?? null);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!draggingClipRef.current) return;
      const folderCard = getFolderAtPoint(e.clientX, e.clientY);
      const folderId = folderCard?.getAttribute("data-folder-id");
      if (folderId) {
        const clip = draggingClipRef.current;
        setClips((prev) => {
          const updated = prev.map((c) =>
            c.timestamp === clip.timestamp ? { ...c, folderId } : c,
          );
          chrome.storage.local.set({ clips: updated });
          return updated;
        });
      }
      draggingClipRef.current = null;
      setDragOver(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const sharedProps: AppState = {
    clips,
    setClips,
    folders,
    pending,
    draggingClipRef,
    dragOver,
    setDragOver,
  };

  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<MainView {...sharedProps} />} />
        <Route
          path="/folder/:folderId"
          element={<FolderView {...sharedProps} />}
        />
      </Routes>
    </MemoryRouter>
  );
}

export default App;
