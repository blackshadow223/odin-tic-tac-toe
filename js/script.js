
const Events = (function() {
    // Initialize
    const events = {};

    // API
    function on(eventName, handler) {
        if (events[eventName]) {
            events[eventName].push(handler);
        } else {
            events[eventName] = [handler];
        }
    }

    function off(eventName, handler) {
        if (events[eventName]) {
            const index = events[eventName].indexOf(handler);
            events[eventName].splice(index, 1);
        }
    }

    function emit(eventName, data) {
        if (events[eventName]) {
            events[eventName].forEach(handler => {
                handler(data);
            });
        }
    }

    return {
        on,
        off,
        emit
    };
})()

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

    function _switchActiveMarker() {
        if (activeMark === markers[0]) {
            activeMark = markers[1];
        } else {
            activeMark = markers[0];
        }
        Events.emit("activeMarkChanged", null);
    }

    function playRound(row, column) {
        if (board.setCell(row, column, activeMark)) {
            // Here comes the win logic for the game
            // ...

            const Board = board.getBoard();
            const positions = {};

            Board.forEach((array, i) => {
                array.forEach((value, j) => {
                    if (value) {
                        if (positions[value]) {
                            positions[value].push(i * 3 + j);
                        } else {
                            positions[value] = [i * 3 + j];
                        }
                    }
                });
            });

            const winPositions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            for (let mark in positions) {
                const pos = positions[mark];

                winPositions.forEach(wins => {
                    if (
                        pos.includes(wins[0]) &&
                        pos.includes(wins[1]) &&
                        pos.includes(wins[2])
                    ) {
                        Events.emit("declaredWinner", wins);
                    }
                });
            }

            _switchActiveMarker();
        }
    }

    function reset() {
        board.resetBoard();

        if (activeMark !== markers[0]) {
            _switchActiveMarker();
        }
    }

    return {
        getActiveMarker,
        playRound,
        reset,
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
    Events.on("activeMarkChanged", _switchActivePlayer);
    Events.on("declaredWinner", _declareWinner);

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
        if (event.target.id === "player1") {
            let name = prompt("Enter Name for Player 1: ");

            if (name) {
                playerOne.textContent = name;
            }
        } else if (event.target.id === "player2") {
            let name = prompt("Enter Name for Player 2: ");

            if (name) {
                playerTwo.textContent = name;
            }
        }
    }

    function _resetHandler() {
        game.reset();

        playerOne.textContent = "Player 1";
        playerTwo.textContent = "Player 2";

        Array.from(gameDisplay.children).forEach(element => {
            element.style.padding = "";
            element.firstChild.style.padding = "";
            element.firstChild.removeAttribute("disabled");
        });

        _render();
    }

    function _switchActivePlayer() {
        if (playerOne.className === "active") {
            playerOne.removeAttribute("class");
            playerTwo.setAttribute("class", "active");
        } else {
            playerOne.setAttribute("class", "active");
            playerTwo.removeAttribute("class");
        }
    }

    function _declareWinner(data) {
        data.forEach(value => {
            const element = gameDisplay.children[value];
            element.style.padding = "20px";
            element.firstChild.style.padding = "22px 28px";
            element.firstChild.style.fontSize = "24px";
        });

        Array.from(gameDisplay.children).forEach(element => {
            element.firstChild.setAttribute("disabled", "");
        });
    }
}

DOMLogic();
