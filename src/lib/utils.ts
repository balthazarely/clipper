import { DOT_COLORS } from "./constants";

export function dotColor(id: string) {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return DOT_COLORS[n % DOT_COLORS.length];
}
