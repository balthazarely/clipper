type HeaderProps = {
  onNewGroup: () => void;
};

export function Header({ onNewGroup }: HeaderProps) {
  return (
    <div className="bg-gray-950 px-3.5 py-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="3"
                width="20"
                height="5"
                rx="2"
                fill="white"
                fillOpacity="0.9"
              />
              <rect
                x="2"
                y="10"
                width="20"
                height="5"
                rx="2"
                fill="white"
                fillOpacity="0.65"
              />
              <rect
                x="2"
                y="17"
                width="20"
                height="5"
                rx="2"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            Tab Vault
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="bg-indigo-600 text-white rounded-lg w-7.5 h-7.5 flex items-center justify-center cursor-pointer transition-colors hover:bg-indigo-700"
            onClick={onNewGroup}
            title="Save tab group"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
