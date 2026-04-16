import { Reorder, useDragControls } from "framer-motion";
import { FolderCard } from "../FolderCard/FolderCard";
import type { Folder } from "../../lib/types";

type SortableFolderProps = {
  folder: Folder;
  count: number;
  onNavigate: () => void;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  onUpdateAppearance?: (icon: string, iconColor: string) => void;
};

export function SortableFolder({ folder, count, onNavigate, onRename, onDelete, onUpdateAppearance }: SortableFolderProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item key={folder.id} value={folder} as="div" dragListener={false} dragControls={controls} className="flex-1 min-w-0">
      <FolderCard
        id={folder.id}
        name={folder.name}
        icon={folder.icon}
        iconColor={folder.iconColor}
        count={count}
        onClick={onNavigate}
        dragControls={controls}
        onRename={onRename}
        onDelete={onDelete}
        onUpdateAppearance={onUpdateAppearance}
      />
    </Reorder.Item>
  );
}
