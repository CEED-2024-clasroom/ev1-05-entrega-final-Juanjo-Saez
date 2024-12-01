import { getElementCenter, lengthAndAngle } from "./lib/line_position.js";
import { normalizeGamePosition } from "./normalizer.js";

let selectedLetters = [];
let activeLine; 
let activeLetter; 
let fixedLines = []; 
let isMouseDown = false;
const main = document.querySelector("main");
const grid = document.getElementById("grid");

function createLine(origin) {
  const lineDiv = document.createElement("div");
  lineDiv.classList.add("line");

  lineDiv.style.left = `${origin[0]}px`;
  lineDiv.style.top = `${origin[1]}px`;

  main.insertAdjacentElement("afterend", lineDiv);
  return lineDiv;
}

function addSelectedClass() {
  if (!activeLetter.classList.contains("selected")) {
    activeLetter.classList.add("selected");
    selectedLetters.push(activeLetter);

    const { x, y } = getElementCenter(activeLetter);
    if (!activeLine) {
      activeLine = createLine([x, y]);
    }
  }
}

function handleMouseDown(event) {
  const letterDiv = event.target;
  if (!letterDiv.classList.contains("wheel-letter")) return;

  activeLetter = letterDiv;
  isMouseDown = true;

  addSelectedClass();
}

function updateLine(hoveredLetter) {
  const { x: activeX, y: activeY } = getElementCenter(activeLetter);
  const { x: hoveredX, y: hoveredY } = getElementCenter(hoveredLetter);
  const origin = [activeX, activeY];
  const end = [hoveredX, hoveredY];

  const { length, angle } = lengthAndAngle(origin, end);

  activeLine.style.width = `${length}px`;
  activeLine.style.transform = `rotate(${angle}deg)`;

  fixedLines.push(activeLine);
  activeLine = createLine(end);
  activeLetter = hoveredLetter;
}

function isValidHoveredLetter(letter) {
  return (
    letter &&
    letter.classList.contains("wheel-letter") &&
    !letter.classList.contains("selected")
  );
}

function handleHoveredLetter(hoveredLetter) {
  updateLine(hoveredLetter);
  addSelectedClass();
}

function updateActiveLine(mouseX, mouseY) {
  const { x, y } = getElementCenter(activeLetter);
  const origin = [x, y];
  const end = [mouseX, mouseY];
  const { length, angle } = lengthAndAngle(origin, end);

  activeLine.style.width = `${length}px`;
  activeLine.style.transform = `rotate(${angle}deg)`;
}

function handleMouseMove(event) {
  if (!isMouseDown) return;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const hoveredLetter = document.elementFromPoint(mouseX, mouseY);

  if (isValidHoveredLetter(hoveredLetter)) {
    handleHoveredLetter(hoveredLetter);
  } else if (activeLine) {
    updateActiveLine(mouseX, mouseY);
  }
}

function addWordToGrid(position, word, game) {
  const { direction, origin } = position;
  const { row, col } = normalizeGamePosition(origin);

  for (let i = 0; i < word.length; i++) {
    const targetRow = direction === "horizontal" ? row : row + i;
    const targetCol = direction === "horizontal" ? col + i : col;

    const letterDiv = Array.from(grid.children).find((div) => {
      const gridArea = div.style.gridArea;
      return gridArea === `${targetRow} / ${targetCol}`;
    });

    if (letterDiv) {
      letterDiv.innerText = word[i]; 
      const cell = game.cells.find(
        (cell) => cell.col === targetCol && cell.row === targetRow
      );
      cell.letter = word[i];
    }
  }
}

function printWords(selectedLetters, game) {
  let word = "";

  selectedLetters.forEach((letterDiv) => {
    word += letterDiv.innerText;
  });

  try {
    const wordPosition = game.gameData.findWord(word); 
    addWordToGrid(wordPosition, word, game); 
  } catch (error) {
    if (error.name === "WordNotFound") {
      console.log(`La palabra "${word}" no está en el juego.`);
    } else {
      console.error("Error inesperado:", error);
    }
  }
}

function handleMouseUp(game) {
  if (!activeLine) return;

  activeLine.remove();
  activeLine = null;

  fixedLines.forEach((line) => line.remove());
  fixedLines = [];

  printWords(selectedLetters, game);
  selectedLetters.forEach((letter) => letter.classList.remove("selected"));
  selectedLetters = [];

  isMouseDown = false;
}

export function createGameWheel(game) {
  const wheel = document.getElementById("wheel");

  const existingLetters = wheel.getElementsByClassName("wheel-letter");
  while (existingLetters.length > 0) {
    existingLetters[0].remove();
  }

  game.wheelLetters.forEach(({ left, top, letter }) => {
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("wheel-letter");
    letterDiv.style.left = left;
    letterDiv.style.top = top;
    letterDiv.textContent = letter;

    letterDiv.addEventListener("mousedown", handleMouseDown);

    wheel.appendChild(letterDiv);
  });

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", () => handleMouseUp(game));
}
