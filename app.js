// Get DOM elements
const $subtitle = document.getElementById('subtitle');
const $gridElements = document.querySelectorAll('.grid');


// Game Board Module
const gameBoard = (() => {

    // Properties //
    const _board = [...Array(9)];
    const _$gridBoard = document.getElementById('grid-container');


    // Public Functions //

    /** 
     * Returns the value of the board at given index
     * @param {number} idx the index
     */
    const getValue = (idx) => {
        return _board[idx];
    }

    /** 
     * Sets a value on the board at given index
     * @param {number} idx the index
     * @param {'X' | 'O'} value the value
     */
    const setValue = (idx, value) => {
        _board[idx] = value;
    }

    /** 
     * Clears the whole board (both memory values and view values)
     */
    const clear = () => {
        _board = _board.fill(undefined);

        _$gridBoard.forEach(gridElement => {
            gridElement.firstElementChild.innerHTML = '';
            gridElement.firstElementChild.classList.remove('color-x');
            gridElement.firstElementChild.classList.remove('color-o');
        });
    }


    /**
     * Returns true if there is no more movements to make on the board
     */
    const isBoardFull = () => {
        return _board.every(item => item);
    }


    const getRowsAsArrays = () => {
        return [
            _board.slice(0, 3),
            _board.slice(3, 6),
            _board.slice(6, 9),
        ];
    }


    const getColumnsAsArrays = () => {
        return [
            [getValue(0), getValue(3), getValue(6)],
            [getValue(1), getValue(4), getValue(7)],
            [getValue(2), getValue(5), getValue(8)],
        ];
    }


    const getDiagonalsAsArrays = () => {
        return [
            [getValue(0), getValue(4), getValue(8)],
            [getValue(2), getValue(4), getValue(6)],
        ];
    }

    return {
        getRowsAsArrays,
        getColumnsAsArrays,
        getDiagonalsAsArrays,
        getValue,
        _board,
        setValue,
        isBoardFull,
        clear
    }

})();

// Game Module
const game = (() => {

    // Properties //
    let _finished = false;
    let _isPlayerTurn = true;
    let _isComputerTurn = false;
    let _computerGridElementChoice = null;


    // Public Functions //

    /** 
     * Adds event listeners to DOM elements
     */
    const initialize = () => {

        // Click event listener for grid elements
        $gridElements.forEach(gridElement => {
            gridElement.addEventListener('click', () => {
                if (_finished) return;
                if (!_isPlayerTurn) return;


                // Checks if the grid element is playable
                if (gameBoard.getValue(gridElement.id - 1)) return;

                _playAtGridElement(gridElement);

                // Check if the player won
                _checkGameFinished('P');


                if (_finished) return;


                _makeComputerChoice();
                _playAtGridElement(_computerGridElementChoice);

                // Check if the computer won
                _checkGameFinished('C');
            });
        });
    };


    // Private Functions //

    /**
     * Based on the difficulty (random for now), the computer chooses a grid element to play
     */
    const _makeComputerChoice = () => {

        // A random number bewteen 0 and 8 (9 posibilities)
        const randomChoice = Math.floor(Math.random() * 8);

        // If the index is playable
        if (!gameBoard.getValue(randomChoice)) {

            $gridElements.forEach((gridElement, idx) => {
                if (idx === randomChoice) {
                    _computerGridElementChoice = gridElement;
                }
            });

        } else if (gameBoard.isBoardFull()) {
            return;

        } else { // Recursive so calculates another random choice
            _makeComputerChoice();
        }
    };


    /**
     * Puts an 'X' or an 'O' depending whose turn is it and changes turn
     * @param {Element} gridElement the grid element to play
     */
    const _playAtGridElement = (gridElement) => {
        if (_isPlayerTurn) {
            gameBoard.setValue(gridElement.id - 1, 'X');
            gridElement.firstElementChild.classList.add('color-x');
            gridElement.firstElementChild.innerHTML = 'X';
            _isPlayerTurn = false;
            _isComputerTurn = true;
        } else {
            gameBoard.setValue(gridElement.id - 1, 'O');
            gridElement.firstElementChild.classList.add('color-o');
            gridElement.firstElementChild.innerHTML = 'O';
            _isComputerTurn = false;
            _isPlayerTurn = true;
        }
    };


    /**
     * @param {'P' | 'C'} lastPlay if the last was made by the user or by the computer
     */
    const _checkGameFinished = (lastPlay) => {
        if (_isGameWon()) {
            _finished = true;

            if (lastPlay === 'P') {
                $subtitle.textContent = 'You won! 😄';
            } else {
                $subtitle.textContent = 'You lost! 🤣';
            }

        } else if (gameBoard.isBoardFull()) {
            _finished = true;
            $subtitle.textContent = 'Its a draw! 🥲';
        }
    };


    const _isGameWon = () => {
        return _checkWinByParam('R') || _checkWinByParam('C') || _checkWinByParam('D');
    }

    /**
     * Checks if there is a win in param
     * @param {'R' | 'C' | 'D'} param 'R' (rows), 'C' (columns), 'D' (diagonals)
     */
    const _checkWinByParam = (param) => {

        if (!param) return;

        let iterable;

        if (param === 'R') iterable = gameBoard.getRowsAsArrays();
        if (param === 'C') iterable = gameBoard.getColumnsAsArrays();
        if (param === 'D') iterable = gameBoard.getDiagonalsAsArrays();

        if (!iterable) return;

        // Iterable is an array of arrays
        // Checks if any array into iterable has all items the same (X or O)
        return iterable.some(childIterable => {
            return childIterable.every(cell => cell === 'X') || childIterable.every(cell => cell === 'O')
        });
    };


    return {
        initialize
    }
})();



const main = () => {
    game.initialize();
}

main();