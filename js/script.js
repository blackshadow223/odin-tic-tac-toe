
function GameBoard() {
    // Initialize
    const board = [];

    for (let i = 0; i < 3; ++i) {
        board[i] = []; // Add another dimension

        for (let j = 0; j < 3; ++j) {
            board[i].push(""); // Empty Value
        }
    }

    // API
    function getBoard() {
        const newBoard = board; // To make board read-only
        return newBoard;
    }

    function setCell(row, column, marker) {
        if (row > 2 || column > 2) {
            return false;
        } else if (board[row][column]) {
            return false;
        }
        board[row][column] = marker;
        return true;
    }

    function resetBoard() {
        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                board[i][j] = "";
            }
        }
    }

    return {
        getBoard,
        setCell,
        resetBoard
    };
}

function GameLogic() {
    const board = GameBoard();

    const markers = ["X", "O"];

    let activeMark = markers[0];

    function getActiveMarker() {
        return activeMark;
    }

    function switchActiveMarker() {
        if (activeMark === markers[0]) {
            activeMark = markers[1];
        } else {
            activeMark = markers[0];
        }
    }

    function playRound(row, column) {
        if (board.setCell(row, column, activeMark)) {
            // Here comes the win logic for the game
            // ...

            switchActiveMarker();
        }
    }

    return {
        getActiveMarker,
        playRound,
        getBoard: board.getBoard
    };
}

function DOMLogic() {
    // Initialize
    const game = GameLogic();

    // Cache DOM
    const container = document.querySelector(".container");
    const playerNames = container.querySelector(".player-names");
    const playerOne = playerNames.querySelector("#player1");
    const playerTwo = playerNames.querySelector("#player2");
    const gameDisplay = container.querySelector(".game");
    const resetBtn = container.querySelector("#reset");

    // Bind Events
    gameDisplay.addEventListener("click", _boardHandler);
    playerNames.addEventListener("dblclick", _nameHandler);
    resetBtn.addEventListener("click", _resetHandler);

    // Logic
    function _render() {
        const board = game.getBoard();

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                // Calculate place of the element from given row and column
                const place = i * 3 + j;
                const element = gameDisplay.children[place].firstChild;

                element.textContent = board[i][j];
            }
        }
    }

    function _boardHandler(event) {
        if (event.target.className === "btn") {
            const boardUI = Array.from(gameDisplay.children);

            // Calulate row and column from the given element index
            const place = boardUI.indexOf(event.target.parentNode);
            const row = parseInt(place / 3);
            const column = place % 3;

            game.playRound(row, column);
            _render();
        }
    }

    function _nameHandler(event) {
        return;
    }

    function _resetHandler(event) {
        return;
    }
}

DOMLogic();
