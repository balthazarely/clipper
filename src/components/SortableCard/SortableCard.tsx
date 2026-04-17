import { Reorder, useDragControls } from "framer-motion";
import { GroupCard } from "../GroupCard/GroupCard";
import type { Folder, Label, TabGroup } from "../../lib/types";

type SortableCardProps = {
  g: TabGroup;
  folders: Folder[];
  labels: Label[];
  onDelete: () => void;
  onMove: (folderId: string | undefined) => void;
  onUpdate: (tabs: import("../../lib/types").SavedTab[]) => void;
  onRename: (newName: string) => void;
  onUpdateAppearance: (icon: string, iconColor: string) => void;
  onCreateFolder: (name: string) => void;
  onUpdateDescription?: (description: string) => void;
  onUpdateLabel?: (label: string) => void;
};

export function SortableCard({ g, folders, labels, onDelete, onMove, onUpdate, onRename, onUpdateAppearance, onCreateFolder, onUpdateDescription, onUpdateLabel }: SortableCardProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={g}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      className="flex-1 min-w-0"
    >
      <GroupCard
        g={g}
        folders={folders}
        labels={labels}
        onDelete={onDelete}
        onMove={onMove}
        onUpdate={onUpdate}
        onRename={onRename}
        onUpdateAppearance={onUpdateAppearance}
        onCreateFolder={onCreateFolder}
        onUpdateDescription={onUpdateDescription}
        onUpdateLabel={onUpdateLabel}
        dragControls={controls}
      />
    </Reorder.Item>
  );
}
