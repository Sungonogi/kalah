
/**
 * Assumes the move is legal (and thus on the side that has the turn)
 * @param {Object} board - The current board position.
 * @param {number} position - The position of the pit to move from.
 * @returns {Object} - The new board position.
 */
function performLegalMove(board, position) {
    const myPits = board.southTurn ? [...board.southPits] : [...board.northPits];
    const hisPits = board.southTurn ? [...board.northPits] : [...board.southPits];
    const myStore = board.southTurn ? board.southStore : board.northStore;

    let currentlyMySide = true;
    let hand = myPits[position];
    myPits[position] = 0;

    let updatedMyStore = myStore;

    while (hand > 0) {
        position = (position + 1) % (board.pits + 1);

        if (position < board.pits) {
            hand--;
            if (currentlyMySide) {
                myPits[position]++;
            } else {
                hisPits[position]++;
            }
        } else {
            if (currentlyMySide) {
                hand--;
                updatedMyStore++;
            }
            currentlyMySide = !currentlyMySide;
        }
    }

    // Check for steal
    const mirrored = board.pits - position - 1;
    if (currentlyMySide && myPits[position] === 1 && hisPits[mirrored] > 0) {
        updatedMyStore += myPits[position] + hisPits[mirrored];
        myPits[position] = 0;
        hisPits[mirrored] = 0;
    }

    // Check for bonus move (if not landing in the store)
    let updatedSouthTurn = !board.southTurn;
    if (!currentlyMySide && position === board.pits) {
        updatedSouthTurn = board.southTurn;
    }

    // Prepare the new pit arrays and store values
    const newSouthPits = board.southTurn ? myPits : hisPits;
    const newNorthPits = board.southTurn ? hisPits : myPits;
    let newSouthStore = board.southTurn ? updatedMyStore : board.southStore;
    let newNorthStore = board.southTurn ? board.northStore : updatedMyStore;

    // Check if the game is over
    const sum = (a, b) => a + b;
    const southSum = newSouthPits.reduce(sum, 0);
    const northSum = newNorthPits.reduce(sum, 0);
    let gameOver = false;
    if (southSum === 0 || northSum === 0) {
        newSouthStore += southSum;
        newNorthStore += northSum;
        newSouthPits.fill(0);
        newNorthPits.fill(0);
        gameOver = true;
    }

    // Return a new board position with the updated state
    const newBoard = {
        pits: board.pits,
        southPits: newSouthPits,
        northPits: newNorthPits,
        southStore: newSouthStore,
        northStore: newNorthStore,
        southTurn: updatedSouthTurn,
        gameOver: gameOver
    };

    return newBoard;
}

/**
 * Generates 2n random board positions with 2 <= pits <= 14 and 1 <= 12 seeds.
 * @param {number} n - The number of pairs of boards to generate.
 * @returns {Array} - An array of randomly generated board positions.
 */
function generateBoards(n) {
    const boards = [];
    for (let i = 0; i < n; i++) {
        const pits = Math.floor(Math.random() * 13) + 2; // Random number between 2 and 14
        const southPits = Array.from({ length: pits }, () => Math.floor(Math.random() * 5)); // Random seeds between 0 and 4
        if(southPits.reduce((a, b) => a + b, 0) === 0) {
            southPits[Math.floor(Math.random() * pits)] = 1; // Ensure at least one seed
        }

        const board1 = {
            pits,
            southPits: [...southPits],
            northPits: [...southPits],
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        };

        const board2 = {
            pits,
            southPits: [...southPits],
            northPits: [...southPits],
            southStore: 0,
            northStore: 0,
            southTurn: false,
            gameOver: false
        };

        boards.push(board1, board2);
    }
    return boards;
}

// Export the function for use in other files
export { performLegalMove, generateBoards };