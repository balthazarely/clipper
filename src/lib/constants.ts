export const DOT_COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const GROUP_ICONS: { id: string; label: string; svg: string }[] = [
  {
    id: "layers",
    label: "Layers",
    svg: '<rect x="2" y="3" width="20" height="4" rx="1"/><rect x="2" y="10" width="20" height="4" rx="1"/><rect x="2" y="17" width="20" height="4" rx="1"/>',
  },
  { id: "bookmark", label: "Bookmark", svg: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' },
  {
    id: "star",
    label: "Star",
    svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  { id: "code", label: "Code", svg: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  {
    id: "globe",
    label: "Globe",
    svg: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  },
  {
    id: "briefcase",
    label: "Briefcase",
    svg: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  },
  {
    id: "book",
    label: "Book",
    svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  },
  { id: "zap", label: "Zap", svg: '<polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  {
    id: "folder",
    label: "Folder",
    svg: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  },
  {
    id: "heart",
    label: "Heart",
    svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  },
  {
    id: "inbox",
    label: "Inbox",
    svg: '<polyline points="22 12 18 12 15 21 9 21 6 12 2 12"/><path d="M9 3h6v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3z"/>',
  },
  {
    id: "archive",
    label: "Archive",
    svg: '<polyline points="21 8 21 21 3 21 3 8"/><line x1="1" y1="8" x2="23" y2="8"/><path d="M10 12l2 2 4-4"/>',
  },
  {
    id: "target",
    label: "Target",
    svg: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="9"/>',
  },
];

export const ROUTE_TRANSITION = {
  duration: 0.25,
  ease: "easeInOut",
} as const;

export const CARD_ACCORDION_TRANSITION = {
  height: {
    type: "spring",
    stiffness: 800,
    damping: 35,
    mass: 0.5,
  },
  opacity: { duration: 0.15 },
} as const;

export const CARD_ACCORDION_ICON_TRANSITION = "transform 0.2s";
