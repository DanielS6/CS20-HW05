document.addEventListener( 'DOMContentLoaded', function () {

    // elements in document order
    const gridElements = [];
    let gridTable;
    const makeTable = () => {
        const makeCell = () => {
            const td = document.createElement('td');
            gridElements.push(td);
            return td;
        };
        const makeRow = () => {
            const tr = document.createElement('tr');
            tr.append(makeCell(), makeCell(), makeCell());
            return tr;
        };
        const tbody = document.createElement('tbody');
        tbody.append(makeRow(), makeRow(), makeRow());
        const table = document.createElement('table');
        table.setAttribute('id', 'game-grid');
        table.append(tbody);
        return table;
    };
    const currPlayerWrapper = document.getElementById('current-player-wrapper');
    const currPlayerDisplay = document.getElementById('current-player');
    let currPlayerName = currPlayerDisplay.textContent;
    const resultDisplay = document.getElementById('result-note');

    const setCurrentPlayer = (playerName) => {
        currPlayerDisplay.textContent = playerName;
        currPlayerName = playerName;
    }

    let gameOver = false;
    const endGame = (message, isVictory) => {
        gameOver = true;
        currPlayerWrapper.classList.add('hidden');
        gridTable.classList.add('game-over');
        resultDisplay.textContent = message;
        if (isVictory) {
            resultDisplay.classList.add('result-victory');
        }
    };
    const checkWinner = (squares, [id1, id2, id3]) => {
        if (squares[id1] === null
            || squares[id1] !== squares[id2]
            || squares[id1] !== squares[id3]
        ) {
            // no need to check squares[id2] vs squares[id3], if they are
            // both equal to squares[id1] they must equal each other
            return false;
        }
        gridElements[id1].classList.add('winning-line');
        gridElements[id2].classList.add('winning-line');
        gridElements[id3].classList.add('winning-line');
        endGame('Player ' + squares[id1] + ' wins!', /* victory? */ true);
    };
    const checkState = () => {
        const makeLine = (start, inc) => [start, start + inc, start + inc * 2];
        const allLines = [
            makeLine(0, 1), makeLine(3, 1), makeLine(6, 1), // rows
            makeLine(0, 3), makeLine(1, 3), makeLine(2, 3), // columns
            makeLine(0, 4), makeLine(2, 2) // diagonals
        ];
        const squareValues = gridElements.map(getPlayer);
        for (let lineIdx = 0; lineIdx < allLines.length; lineIdx++) {
            if (checkWinner(squareValues, allLines[lineIdx])) {
                return;
            }
        }
        // might be a draw, if none are null
        if (squareValues.every(p => p !== null)) {
            endGame('The game was a stalemate.', /* victory? */ false);
        }
    }

    const getPlayer = (elem) => elem.getAttribute('player');
    const onSquareClick = (elem) => {
        if (gameOver || getPlayer(elem) !== null) {
            // square already taken or game is over
            return;
        }
        elem.setAttribute('player', currPlayerName);
        elem.textContent = currPlayerName;
        checkState();
        setCurrentPlayer(currPlayerName === 'X' ? 'O' : 'X');
    };

    const resetGame = () => {
        gridElements.forEach(e => {
            e.removeAttribute('player');
            e.textContent = '';
            e.classList.remove('winning-line');
        });
        resultDisplay.classList.remove('result-victory');
        resultDisplay.textContent = "";
        currPlayerWrapper.classList.remove('hidden');
        gridTable.classList.remove('game-over');
        setCurrentPlayer('X');
        gameOver = false;
    }

    const setup = () => {
        gridTable = makeTable();
        resultDisplay.after(gridTable);
        gridElements.forEach(
            elem => {
                elem.addEventListener('click', () => onSquareClick(elem));
            }
        );
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', resetGame);
    };
    setup();
} );