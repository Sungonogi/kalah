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

function getLegalMoves(board) {
    const pits = board.southTurn ? board.southPits : board.northPits;
    const moves = [];
    for(let i = 0; i < pits.length; i++){
        if(pits[i] > 0){
            moves.push(i);
        }
    }
    return moves;
}

// random number generator that allows for seeding, I want to seed with the amount of boards
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function sfc32(a, b, c, d) {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0;
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
  }
  
const getRand = (n) => sfc32(3569758038, 1525327611, 2985216974, n);

/**
 * Generates 2n random board positions with 2 <= pits <= 14 and 1 <= 12 seeds.
 * @param {number} n - The number of pairs of boards to generate.
 * @returns {Array} - An array of randomly generated board positions.
 */
async function generateBoards(n) {
    const rand = getRand(n);

    const boards = [];
    for (let i = 0; i < n; i++) {
        const pits = Math.floor(rand() * 9) + 2; // Random number between 2 and 10
        const seeds = Math.floor(rand() * 6) + 1; // Random number between 1 and 6

        let board1 = {
            pits,
            southPits: Array(pits).fill(seeds),
            northPits: Array(pits).fill(seeds),
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        };

        // do 0 to 2 random moves
        const amountOfMoves = Math.floor(rand() * 3);
        for(let j = 0; j < amountOfMoves && !board1.gameOver; j++){
            const moves = getLegalMoves(board1);
            const move = moves[Math.floor(rand() * moves.length)];
            board1 = performLegalMove(board1, move);
        }

        if(board1.gameOver){
            i--;
            continue
        }

        // exact mirror of board1
        const board2 = {
            pits,
            southPits: [...board1.northPits],
            northPits: [...board1.southPits],
            southStore: board1.northStore,
            northStore: board1.southStore,
            southTurn: !board1.southTurn,
            gameOver: false
        };

        boards.push(board1, board2);
    }
    return boards;
}

// Export the function for use in other files
export { performLegalMove, generateBoards };