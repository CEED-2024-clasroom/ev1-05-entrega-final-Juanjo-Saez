let handleClickWrapper; 

export function revealRandomLetter(game) {
  if (game.cells.every((cell) => cell.letter)) return;

  const grid = document.getElementById("grid");
  const randomNumber = Math.floor(Math.random() * game.cells.length);
  const randomCell = game.cells[randomNumber];
  const randomLetter = game.gameData.letterAt(randomCell.x, randomCell.y);

  const letterDiv = Array.from(grid.children).find((div) => {
    const gridArea = div.style.gridArea;
    return gridArea === `${randomCell.row} / ${randomCell.col}`;
  });

  if (letterDiv && !letterDiv.innerText) {
    letterDiv.innerText = randomLetter;
    game.cells[randomNumber].letter = randomLetter;
  } else if (letterDiv.innerText) {
    revealRandomLetter(game);
  }
}

export function revealFiveLetters(game) {
  for (let i = 0; i < 5; i++) {
    revealRandomLetter(game);
  }
}

export function suffleLettersWheel(game) {
  const shuffledWheelLetters = [...game.wheelLetters].sort(
    () => Math.random() - 0.5
  );

  game.wheelLetters = shuffledWheelLetters;

  const wheel = document.getElementById("wheel");
  const letters = Array.from(wheel.getElementsByClassName("wheel-letter"));

  letters.forEach((letterDiv, index) => {
    const { left, top } = game.wheelLetters[index];
    letterDiv.style.left = left;
    letterDiv.style.top = top;
  });
}

function getPositionWithoutOffset(game, row, col) {
  const cell = game.cells.find((cell) => cell.row === row && cell.col === col);
  return cell ? { x: cell.x, y: cell.y } : null;
}

export function removeHammerHint() {
  const black = document.getElementById("black");
  black.classList.add("hidden");

  const grid = document.getElementById("grid");
  const letters = Array.from(grid.getElementsByClassName("letter"));

  letters.forEach((letter) => {
    letter.classList.remove("on-top");
  });

  if (handleClickWrapper) {
    document.removeEventListener("click", handleClickWrapper);
    handleClickWrapper = null;
  }
}

function handleLetterClick(game, letter) {
  if (!letter.innerText) {
    const gridArea = letter.style.gridArea;
    const [row, col] = gridArea.split(" / ").map(Number);
    const { x, y } = getPositionWithoutOffset(game, row, col);
    letter.innerText = game.gameData.letterAt(x, y);
    removeHammerHint();
  }
}

export function handleClick(game, event) {
  const elementDiv = event.target;

  if (elementDiv.id !== "black") {
    if (elementDiv.classList.contains("letter")) {
      handleLetterClick(game, elementDiv);
    }
  } else {
    removeHammerHint();
  }
}

export function hammerHint(game) {
  const black = document.getElementById("black");
  const grid = document.getElementById("grid");
  const letters = Array.from(grid.getElementsByClassName("letter"));

  if (black.classList.contains("hidden")) {
    black.classList.remove("hidden");

    letters.forEach((letter) => {
      letter.classList.add("on-top");
    });

    if (handleClickWrapper) {
      document.removeEventListener("click", handleClickWrapper);
    }

    handleClickWrapper = (event) => handleClick(game, event);
    document.addEventListener("click", handleClickWrapper);
  }
}
