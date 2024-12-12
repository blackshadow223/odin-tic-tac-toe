console.log("Hello, World!");
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
