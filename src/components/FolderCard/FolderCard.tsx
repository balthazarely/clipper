import { dotColor } from "../../lib/utils";
import type { DragControls } from "framer-motion";

type FolderCardProps = {
  id: string;
  name: string;
  count: number;
  onClick: () => void;
  dragControls?: DragControls;
};

export function FolderCard({
  id,
  name,
  count,
  onClick,

  dragControls,
}: FolderCardProps) {
  const isUngrouped = id === "ungrouped";
  const color = isUngrouped ? "#94a3b8" : dotColor(id);

  return (
    <div
      className="relative flex flex-row items-center gap-3 bg-white rounded-2xl p-4 cursor-pointer border border-gray-200 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-300 text-left"
      onClick={onClick}
    >
      {/* Drag handle - only show if dragControls provided */}
      {dragControls && (
        <button
          className="touch-none flex items-center justify-center w-6 h-6 shrink-0 text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dragControls.start(e);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="3" cy="2" r="1.4" />
            <circle cx="7" cy="2" r="1.4" />
            <circle cx="3" cy="7" r="1.4" />
            <circle cx="7" cy="7" r="1.4" />
            <circle cx="3" cy="12" r="1.4" />
            <circle cx="7" cy="12" r="1.4" />
          </svg>
        </button>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: color + "20" }}
      >
        {isUngrouped ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="4" rx="1" />
            <rect x="2" y="10" width="20" height="4" rx="1" />
            <rect x="2" y="17" width="20" height="4" rx="1" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0 ">
        <span className="block text-sm font-semibold text-gray-900 truncate">
          {name}
        </span>
        <span className="block text-xs text-gray-400">
          {count} {count === 1 ? "group" : "groups"}
        </span>
      </div>
    </div>
  );
}
