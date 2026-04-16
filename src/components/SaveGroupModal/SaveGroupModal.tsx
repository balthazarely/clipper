import { useState, useEffect, useRef } from "react";
import type { Folder, TabGroup } from "../../lib/types";

type Props = {
  tabs: chrome.tabs.Tab[];
  folders: Folder[];
  onSave: (group: TabGroup) => void;
  onClose: () => void;
};

const field: React.CSSProperties = {
  width: "100%", fontSize: 13, color: "#111827", background: "transparent",
  border: "none", outline: "none", fontFamily: "inherit", padding: 0,
};

const divider = <div style={{ height: 1, background: "#f3f4f6", margin: "0 14px" }} />;

export function SaveGroupModal({ tabs, folders, onSave, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [folderId, setFolderId] = useState("");
  const [tabNotes, setTabNotes] = useState<Record<number, string>>({});

  const validTabs = tabs.filter((t) => t.url && t.title);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      folderId: folderId || undefined,
      savedAt: Date.now(),
      tabs: validTabs.map((t) => ({
        title: t.title!,
        url: t.url!,
        favIconUrl: t.favIconUrl,
        note: tabNotes[t.id!]?.trim() || undefined,
      })),
    });
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="modal modal-bottom" onClose={onClose}>
      <div
        className="modal-box p-0 rounded-t-2xl rounded-b-none max-h-[88vh] w-full max-w-full flex flex-col"
        style={{ background: "#f8f9fb", color: "#111827" }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6 }}>
          <div style={{ width: 32, height: 4, borderRadius: 99, background: "#e2e4e9" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px" }}>
          <div>
            <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 1 }}>
              {validTabs.length} tabs
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
              Save tab group
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#e9eaec", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Details card */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e9eaec", overflow: "hidden" }}>
            {/* Name */}
            <div style={{ padding: "12px 14px" }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Group name</p>
              <input
                type="text"
                style={{ ...field, fontSize: 14, fontWeight: 500 }}
                placeholder="e.g. React research, Work tabs…"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              />
            </div>

            {divider}

            {/* Note */}
            <div style={{ padding: "12px 14px" }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                Note <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span>
              </p>
              <textarea
                style={{ ...field, resize: "none", lineHeight: 1.5 }}
                placeholder="Why are you saving these?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Folder — only if folders exist */}
            {folders.length > 0 && (
              <>
                {divider}
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Folder</p>
                  <select
                    style={{ ...field, cursor: "pointer" }}
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                  >
                    <option value="">Ungrouped</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Tabs card */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, paddingLeft: 2 }}>Tabs</p>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e9eaec", overflow: "hidden" }}>
              {validTabs.map((t, i) => (
                <div key={t.id} style={{ padding: "10px 14px", borderBottom: i < validTabs.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    {t.favIconUrl ? (
                      <img src={t.favIconUrl} style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }} alt="" />
                    ) : (
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: "#e5e7eb", flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {t.title}
                    </span>
                  </div>
                  <input
                    style={{
                      width: "100%", fontSize: 11, color: "#6b7280",
                      background: "transparent", border: "none",
                      borderBottom: "1.5px dashed #e5e7eb", outline: "none",
                      fontFamily: "inherit", paddingBottom: 2, paddingLeft: 22,
                    }}
                    placeholder="Add a note… (optional)"
                    value={tabNotes[t.id!] ?? ""}
                    onChange={(e) => setTabNotes((prev) => ({ ...prev, [t.id!]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 12px 14px", background: "#f8f9fb", borderTop: "1px solid #e9eaec" }}>
          <button
            style={{
              width: "100%", padding: "12px", borderRadius: 12,
              fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em",
              background: name.trim() ? "#4f46e5" : "#c7d2fe",
              border: "none", cursor: name.trim() ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "background 0.15s",
            }}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save group
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
