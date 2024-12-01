import center from "./lib/center.js";
import { normalizeGamePosition } from "./normalizer.js";

export let despXWord = 0;
export let despYWord = 0;

const WIDTH_SIZE = 10;
const HEIGHT_SIZE = 10;

function calculateGridBounds(positions) {
  let maxColumn = 0;
  let maxRow = 0;

  positions.forEach(({ direction, length, origin }) => {
    const [axisX, axisY] = origin;

    if (direction === "horizontal") {
      maxColumn = Math.max(maxColumn, axisX + length - 1);
      maxRow = Math.max(maxRow, axisY);
    } else if (direction === "vertical") {
      maxRow = Math.max(maxRow, axisY + length - 1);
      maxColumn = Math.max(maxColumn, axisX);
    }
  });

  return { maxColumn, maxRow };
}

function createLetterDivs(grid, position, game) {
  const { direction, length, origin } = position;
  const [x, y] = origin;
  const { row, col } = normalizeGamePosition(origin);
  let currentRow, currentCol, currentX, currentY;

  for (let i = 0; i < length; i++) {
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("letter");

    if (direction === "horizontal") {
      currentRow = row;
      currentCol = col + i;
      currentX = x + i;
      currentY = y;
    } else {
      currentRow = row + i;
      currentCol = col;
      currentX = x;
      currentY = y + i;
    }

    const cellExists = game.cells.find(
      (cell) => cell.col === currentCol && cell.row === currentRow
    );

    if (!cellExists) {
      letterDiv.style.gridArea = `${currentRow} / ${currentCol}`;

      game.cells.push({
        x: currentX,
        y: currentY,
        row: currentRow,
        col: currentCol,
      });

      grid.appendChild(letterDiv);
    }
  }
}

export function createGameGrid(game) {
  const wordPositions = game.gameData.wordPositions;
  const grid = document.getElementById("grid");

  const letters = grid.getElementsByClassName("letter");
  while (letters.length > 0) {
    letters[0].remove();
  }

  const { maxColumn, maxRow } = calculateGridBounds(wordPositions);

  const [despX, despY] = center(maxColumn, maxRow, WIDTH_SIZE, HEIGHT_SIZE);

  despXWord = despX;
  despYWord = despY;

  wordPositions.forEach((position) => createLetterDivs(grid, position, game));
}
