/**
    represents one position the board can be in
 */

export interface BoardPosition {
    pits: number; // size of southPits and northPits
    southPits: number[];
    northPits: number[];
    southStore: number;
    northStore: number;
    southTurn: boolean; // true if south has the turn
    gameOver: boolean;
}

/**
 * Creates an instance of BoardPosition.
 * @param {number} pits - The number of pits on each side.
 * @param {number} seeds - The initial number of seeds in each pit.
 */
export function initBoardPosition(pits: number, seeds: number): BoardPosition {
    return {
        pits: pits,
        southPits: Array(pits).fill(seeds),
        northPits: Array(pits).fill(seeds),
        southStore: 0,
        northStore: 0,
        southTurn: true,
        gameOver: false,
    };
}

/**
 * Checks if a move is legal, assumes it is in bounds
 * @param {BoardPosition} board the board position to check
 * @param {number} position - The position of the pit to move from.
 * @param {boolean} onSouthSide - True if the move is on the south side.
 * @returns {boolean} - True if the move is legal.
 */
export function checkLegalMove(board: BoardPosition, position: number, onSouthSide: boolean): boolean {
    if (onSouthSide !== board.southTurn) {
        return false;
    }
    const myPits = onSouthSide ? board.southPits : board.northPits;
    return myPits[position] > 0;
}

/**
 * Assumes the move is legal (and thus on the side that has the turn)
 * @param {BoardPosition} board - The current board position.
 * @param {number} position - The position of the pit to move from.
 * @returns {BoardPosition} - The new board position after the move.
 */
export function performLegalMove(board: BoardPosition, position: number): BoardPosition {
    const myPits = board.southTurn ? [...board.southPits] : [...board.northPits];
    const hisPits = board.southTurn ? [...board.northPits] : [...board.southPits];
    const myStore = board.southTurn ? 'southStore' : 'northStore';

    let currentlyMySide = true;
    let hand = myPits[position];
    myPits[position] = 0;

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
                board[myStore]++;
            }
            currentlyMySide = !currentlyMySide;
        }
    }

    // Check for steal
    const mirrored = board.pits - position - 1;
    if (currentlyMySide && myPits[position] === 1 && hisPits[mirrored] > 0) {
        board[myStore] += myPits[position] + hisPits[mirrored];
        myPits[position] = 0;
        hisPits[mirrored] = 0;
    }

    // Check for bonus move in case it lands in our store
    if (currentlyMySide || position !== board.pits) {
        board.southTurn = !board.southTurn;
    }

    // Update the original arrays with the new values
    if (board.southTurn) {
        board.southPits = myPits;
        board.northPits = hisPits;
    } else {
        board.southPits = hisPits;
        board.northPits = myPits;
    }

    // Check if the game is over
    const sum = (a: number, b: number) => a + b;
    const southSum = board.southPits.reduce(sum);
    const northSum = board.northPits.reduce(sum);
    if (southSum === 0 || northSum === 0) {
        board.northStore += northSum;
        board.northPits.fill(0);
        board.southStore += southSum;
        board.southPits.fill(0);
        board.gameOver = true;
    } else {
        board.gameOver = false;
    }

    return board;
}