import { despXWord, despYWord } from "./grid.js";

export function normalizeGamePosition(origin) {
  const [x, y] = origin;
  const row = y + 1 + despYWord;
  const col = x + 1 + despXWord;

  return { row, col };
}
