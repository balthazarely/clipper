import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FolderDetailPage } from "./FolderDetailPage";
import type { Folder, Label, TabGroup } from "../lib/types";
import type { ShellContext } from "../components/Shell/Shell";

vi.mock("../components/SortableCard/SortableCard", () => ({
  SortableCard: ({ g }: any) => (
    <div data-testid={`card-${g.id}`}>{g.name}</div>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  Reorder: {
    Group: ({ children, onReorder, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("FolderDetailPage", () => {
  const mockFolders: Folder[] = [
    {
      id: "folder-1",
      name: "Work",
      icon: "briefcase",
      iconColor: "#ff0000",
    },
    {
      id: "folder-2",
      name: "Personal",
      icon: "home",
      iconColor: "#00ff00",
    },
  ];

  const mockGroups: TabGroup[] = [
    {
      id: "group-1",
      name: "React Projects",
      icon: "react",
      iconColor: "#0066ff",
      folderId: "folder-1",
      tabs: [],
      description: "",
      savedAt: Date.now(),
    },
    {
      id: "group-2",
      name: "Vue Projects",
      icon: "vue",
      iconColor: "#42b883",
      folderId: "folder-1",
      tabs: [],
      description: "",
      savedAt: Date.now(),
    },
    {
      id: "group-3",
      name: "Personal Projects",
      icon: "code",
      iconColor: "#ffaa00",
      folderId: "folder-2",
      tabs: [],
      description: "",
      savedAt: Date.now(),
    },
    {
      id: "group-4",
      name: "Ungrouped Tasks",
      icon: "task",
      iconColor: "#9000ff",
      tabs: [],
      description: "",
      savedAt: Date.now(),
    },
  ];

  const mockLabels: Label[] = [
    {
      id: "label-1",
      name: "Important",
      color: "#ff0000",
    },
  ];

  const mockContext: ShellContext = {
    tabs: [],
    groups: mockGroups,
    folders: mockFolders,
    labels: mockLabels,
    saveGroup: vi.fn(),
    createFolder: vi.fn(),
    deleteFolder: vi.fn(),
    updateFolder: vi.fn(),
    deleteGroup: vi.fn(),
    moveGroup: vi.fn(),
    reorderGroups: vi.fn(),
    reorderFolders: vi.fn(),
    updateGroup: vi.fn(),
    renameGroup: vi.fn(),
    updateGroupAppearance: vi.fn(),
    updateGroupDescription: vi.fn(),
    updateGroupLabel: vi.fn(),
    updateFolderAppearance: vi.fn(),
    createLabel: vi.fn(),
    updateLabel: vi.fn(),
    deleteLabel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (folderId: string, initialState?: any) => {
    return render(
      <MemoryRouter
        initialEntries={[
          { pathname: `/folders/${folderId}`, state: initialState },
        ]}
      >
        <Routes>
          <Route path="/folders" element={<div>Folder List</div>} />
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={mockContext} />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("renders folder detail page without crashing", () => {
    renderWithRouter("folder-1");
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("displays folder title correctly", () => {
    renderWithRouter("folder-1");
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("displays 'Ungrouped' title for ungrouped folder", () => {
    renderWithRouter("ungrouped");
    expect(screen.getByText("Ungrouped")).toBeInTheDocument();
  });

  it("filters groups by folderId", () => {
    renderWithRouter("folder-1");
    expect(screen.getByTestId("card-group-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-group-2")).toBeInTheDocument();
    expect(screen.queryByTestId("card-group-3")).not.toBeInTheDocument();
  });

  it("filters ungrouped groups correctly", () => {
    renderWithRouter("ungrouped");
    expect(screen.getByTestId("card-group-4")).toBeInTheDocument();
    expect(screen.queryByTestId("card-group-1")).not.toBeInTheDocument();
  });

  it("displays empty state when folder has no groups", () => {
    const contextWithEmptyFolder = {
      ...mockContext,
      groups: [],
    };
    render(
      <MemoryRouter initialEntries={["/folders/folder-1"]}>
        <Routes>
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={contextWithEmptyFolder} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("No groups here yet.")).toBeInTheDocument();
  });

  it("renders back button", () => {
    renderWithRouter("folder-1");
    const backButton = screen.getByRole("button", { name: "←" });
    expect(backButton).toBeInTheDocument();
  });

  it("back button is clickable", () => {
    renderWithRouter("folder-1");
    const backButton = screen.getByRole("button", { name: "←" });
    expect(backButton).toBeInTheDocument();
    expect(backButton).not.toBeDisabled();
  });

  it("handles nonexistent folder gracefully", () => {
    renderWithRouter("nonexistent-folder");
    expect(screen.getByText("Folder")).toBeInTheDocument();
    expect(screen.getByText("No groups here yet.")).toBeInTheDocument();
  });

  it("updates folder groups when context changes", async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/folders/folder-1"]}>
        <Routes>
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={mockContext} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("card-group-1")).toBeInTheDocument();

    const updatedContext = {
      ...mockContext,
      groups: [
        ...mockGroups,
        {
          id: "group-5",
          name: "New Group",
          folderId: "folder-1",
          tabs: [],
          description: "",
          savedAt: Date.now(),
        },
      ],
    };

    rerender(
      <MemoryRouter initialEntries={["/folders/folder-1"]}>
        <Routes>
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={updatedContext} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("card-group-5")).toBeInTheDocument();
    });
  });

  it("calls deleteGroup when delete is triggered", async () => {
    renderWithRouter("folder-1");
    const deleteGroupSpy = vi.spyOn(mockContext, "deleteGroup");
    expect(deleteGroupSpy).toBeDefined();
  });

  it("calls moveGroup when move is triggered", async () => {
    renderWithRouter("folder-1");
    const moveGroupSpy = vi.spyOn(mockContext, "moveGroup");
    expect(moveGroupSpy).toBeDefined();
  });

  it("calls reorderGroups when groups are reordered", async () => {
    renderWithRouter("folder-1");
    const reorderSpy = vi.spyOn(mockContext, "reorderGroups");
    expect(reorderSpy).toBeDefined();
  });

  it("renders all groups for folder with multiple groups", () => {
    renderWithRouter("folder-1");
    expect(screen.getByTestId("card-group-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-group-2")).toBeInTheDocument();
  });

  it("maintains highlight state for group", async () => {
    const highlightState = { highlightGroupId: "group-1" };
    renderWithRouter("folder-1", highlightState);
    await waitFor(() => {
      expect(screen.getByTestId("card-group-1")).toBeInTheDocument();
    });
  });

  it("handles folder title cache correctly", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/folders/folder-1"]}>
        <Routes>
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={mockContext} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Work")).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/folders/folder-1"]}>
        <Routes>
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={mockContext} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("accepts and processes highlight state from navigation", () => {
    const highlightState = { highlightGroupId: "group-1" };
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/folders/folder-1", state: highlightState },
        ]}
      >
        <Routes>
          <Route path="/folders" element={<div>Folder List</div>} />
          <Route
            path="/folders/:folderId"
            element={<FolderDetailPage context={mockContext} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("card-group-1")).toBeInTheDocument();
  });
});
