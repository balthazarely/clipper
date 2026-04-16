import { DOT_COLORS } from "./constants";

export function dotColor(id: string) {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return DOT_COLORS[n % DOT_COLORS.length];
}

export function getDepth(pathname: string): number {
  if (pathname.startsWith("/folders/")) return 2;
  if (pathname === "/folders") return 1;
  return 0;
}
