const Gameboard = (() => {
  let boardState = Array(9).fill("");

  const getCell = (index) => boardState[index];
  const setCell = (index, player) => {
    boardState[index] = player;
  };
  const resetBoard = () => {
    boardState.fill("");
  };

  return { getCell, setCell, resetBoard, boardState };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.querySelector("#statusText");

  const updateStatus = (message) => {
    statusText.textContent = message;
  };

  const clearBoard = () => {
    cells.forEach((cell) => (cell.textContent = ""));
  };

  const renderBoard = () => {
    cells.forEach((cell, index) => {
      cell.textContent = Gameboard.getCell(index);
    });
  };

  return { updateStatus, clearBoard, renderBoard, cells };
})();

const GameController = (() => {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let currentPlayer = "X";
  let running = false;

  const initializeGame = () => {
    DisplayController.cells.forEach((cell) =>
      cell.addEventListener("click", cellClicked)
    );
    document
      .querySelector("#restartBtn")
      .addEventListener("click", restartGame);
    DisplayController.updateStatus(`${currentPlayer}'s turn`);
    running = true;
  };

  const cellClicked = (e) => {
    const cellIndex = e.target.getAttribute("cellIndex");

    if (Gameboard.getCell(cellIndex) !== "" || !running) {
      return;
    }

    Gameboard.setCell(cellIndex, currentPlayer);
    DisplayController.renderBoard();
    checkWinner();
  };

  const changePlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    DisplayController.updateStatus(`${currentPlayer}'s turn`);
  };

  const checkWinner = () => {
    let roundWon = false;

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      const cellA = Gameboard.getCell(a);
      const cellB = Gameboard.getCell(b);
      const cellC = Gameboard.getCell(c);

      if (cellA && cellA === cellB && cellA === cellC) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      DisplayController.updateStatus(`${currentPlayer} wins!`);
      running = false;
    } else if (!Gameboard.boardState.includes("")) {
      DisplayController.updateStatus("Draw!");
      running = false;
    } else {
      changePlayer();
    }
  };

  const restartGame = () => {
    currentPlayer = "X";
    Gameboard.resetBoard();
    DisplayController.clearBoard();
    DisplayController.updateStatus(`${currentPlayer}'s turn`);
    running = true;
  };

  return { initializeGame };
})();

GameController.initializeGame();
