
const Game = (function() {

    const Board = (function() {
        // Board
        const board = [];

        // Each cell can have 3 values
        // Either empty, 'X', or 'O'

        for (let i = 0; i < 3; ++i) {
            // Create a row if not already done
            board[i] = [];

            for (let j = 0; j < 3; ++j) {
                board[i].push("");
            }
        }

        function getCell(row, column) {
            if (row < 3 && column < 3) {
                return board[row][column];
            }
        }

        function setCell(row, column, marker) {
            // Returns false if cell couldn't be set

            if (row < 3 && column < 3) {
                if (!board[row][column]) {
                    board[row][column] = marker;
                    return true;
                }
            }
            return false;
        }

        function resetBoard() {
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    board[i][j] = "";
                }
            }
        }

        return {
            getCell,
            setCell,
            resetBoard
        };
    })();


    const Players = (function() {
        // Players and their names
        // The first player automatically holds the 'X' marker
        const player1 = {
            name: "Player 1",
            marker: "X"
        };

        const player2 = {
            name: "Player 2",
            marker: "O"
        };

        // Each player's turn
        let turn = player1;

        function getPlayerOne() {
            return { name: player1.name, marker: player1.marker };
        }

        function getPlayerTwo() {
            return { name: player2.name, marker: player2.marker };
        }

        function setPlayerNames(name1="Player 1", name2="Player 2") {
            player1.name = name1;
            player2.name = name2;
        }

        function getActivePlayer() {
            return { name: turn.name, marker: turn.marker };
        }

        function switchActivePlayer() {
            if (turn === player1) {
                turn = player2;
            } else {
                turn = player1;
            }
        }

        return {
            getPlayerOne,
            getPlayerTwo,
            setPlayerNames,
            getActivePlayer,
            switchActivePlayer
        };
    })();


    // Play a round of the game
    // Position is going to be an array containing
    // the 2D coordinates of the specific cell that
    // needs to be marked
    function playRound(row, column) {
        const marker = Players.getActivePlayer().marker;

        if (Board.setCell(row, column, marker)) {
            Players.switchActivePlayer();
        }

        /*
        ** Here is where we would check for a winner
        ** and handle that logic
        */
    }

    return {
        playRound: playRound,
        players: {
            getPlayerOne: Players.getPlayerOne,
            getPlayerTwo: Players.getPlayerTwo,
            setPlayerNames: Players.setPlayerNames,
            getActivePlayer: Players.getActivePlayer,
        },
        board: {
            getCell: Board.getCell,
            resetBoard: Board.resetBoard,
        },
    };
})();
