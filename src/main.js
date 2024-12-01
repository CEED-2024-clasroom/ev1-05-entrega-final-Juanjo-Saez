import "./lib/fontawesome.js";
import { Game } from "./lib/Game.js";
import { createGameGrid } from "./grid.js";
import { createGameWheel } from "./wheel.js";
import calculateLetterPositions from "./lib/letter_positions.js";
import {
  revealRandomLetter,
  revealFiveLetters,
  suffleLettersWheel,
  hammerHint,
} from "./buttons.js";

const gameData = new Game();
const letters = gameData.letters.split("");
const wheelPositions = calculateLetterPositions(letters.length);

const game = {
  cells: [],
  gameData,
  wheelLetters: [],
};

letters.forEach((letter, index) => {
  const { left, top } = wheelPositions[index];
  game.wheelLetters.push({ left, top, letter });
});

const lightbulb = document.getElementById("lightbulb");
const expand = document.getElementById("expand");
const shuffle = document.getElementById("shuffle");
const hammer = document.getElementById("hammer");
lightbulb.addEventListener("click", () => revealRandomLetter(game));
expand.addEventListener("click", () => revealFiveLetters(game));
shuffle.addEventListener("click", () => suffleLettersWheel(game));
hammer.addEventListener("click", () => hammerHint(game));

createGameGrid(game);
createGameWheel(game);
