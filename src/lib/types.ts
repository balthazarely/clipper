export type Folder = { id: string; name: string; icon?: string; iconColor?: string };

export type TabGroup = {
  id: string;
  name: string;
  description: string;
  label?: string;
  folderId?: string;
  icon?: string;
  iconColor?: string;
  tabs: SavedTab[];
  savedAt: number;
};

export type SavedTab = {
  title: string;
  url: string;
  favIconUrl?: string;
  note?: string;
};
