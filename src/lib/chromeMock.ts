/**
 * Mocks the chrome extension APIs for local browser development.
 * Only applied when running via `npm run dev` (import.meta.env.DEV).
 */

const STORAGE_KEY = "tabvault_dev_store";

function readStore(): Record<string, unknown> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, unknown>) {
  const current = readStore();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
}

type MockTab = { id: number; title: string; url: string; favIconUrl: string };

const MOCK_TABS: MockTab[] = [
  { id: 1, title: "GitHub · Where software is built", url: "https://github.com", favIconUrl: "https://github.com/favicon.ico" },
  { id: 2, title: "Tailwind CSS - Rapidly build modern websites", url: "https://tailwindcss.com", favIconUrl: "https://tailwindcss.com/favicon.ico" },
  { id: 3, title: "React – The library for web and native user interfaces", url: "https://react.dev", favIconUrl: "https://react.dev/favicon.ico" },
  { id: 4, title: "Hacker News", url: "https://news.ycombinator.com", favIconUrl: "https://news.ycombinator.com/favicon.ico" },
  { id: 5, title: "MDN Web Docs", url: "https://developer.mozilla.org", favIconUrl: "https://developer.mozilla.org/favicon.ico" },
];

const noop = () => {};
const noopListener = { addListener: noop, removeListener: noop, hasListener: () => false };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).chrome = {
  tabs: {
    query: (_: unknown, cb: (tabs: MockTab[]) => void) => { cb(MOCK_TABS); },
    create: (props: { url?: string }) => { if (props.url) window.open(props.url, "_blank"); },
    onCreated: noopListener,
    onRemoved: noopListener,
    onUpdated: noopListener,
  },
  storage: {
    local: {
      get: (_keys: unknown, cb: (result: Record<string, unknown>) => void) => { cb(readStore()); },
      set: (data: Record<string, unknown>, cb?: () => void) => { writeStore(data); cb?.(); },
    },
  },
};
