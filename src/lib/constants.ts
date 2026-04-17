import { FiLayers, FiBookmark, FiStar, FiCode, FiGlobe, FiBriefcase, FiBook, FiZap, FiFolder, FiHeart, FiInbox, FiArchive, FiTarget, FiActivity, FiFilm } from "react-icons/fi";

export const DOT_COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const GROUP_ICONS: { id: string; label: string; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: "layers", label: "Layers", icon: FiLayers },
  { id: "bookmark", label: "Bookmark", icon: FiBookmark },
  { id: "star", label: "Star", icon: FiStar },
  { id: "code", label: "Code", icon: FiCode },
  { id: "globe", label: "Globe", icon: FiGlobe },
  { id: "briefcase", label: "Briefcase", icon: FiBriefcase },
  { id: "book", label: "Book", icon: FiBook },
  { id: "zap", label: "Zap", icon: FiZap },
  { id: "folder", label: "Folder", icon: FiFolder },
  { id: "heart", label: "Heart", icon: FiHeart },
  { id: "inbox", label: "Inbox", icon: FiInbox },
  { id: "archive", label: "Archive", icon: FiArchive },
  { id: "target", label: "Target", icon: FiTarget },
  { id: "activity", label: "Sports", icon: FiActivity },
  { id: "film", label: "Movie", icon: FiFilm },
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
