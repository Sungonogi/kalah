import {BoardPosition} from "./board-position.model";
import {MoveType} from "./move-type.enum";

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
export function performLegalMove(board: BoardPosition, position: number): { board: BoardPosition, moveType: MoveType } {
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
    let moveType = MoveType.Move;
    const mirrored = board.pits - position - 1;
    if (currentlyMySide && myPits[position] === 1 && hisPits[mirrored] > 0) {
        updatedMyStore += myPits[position] + hisPits[mirrored];
        myPits[position] = 0;
        hisPits[mirrored] = 0;
        moveType = MoveType.CaptureMove;
    }

    // Check for bonus move (if not landing in the store)
    let updatedSouthTurn = !board.southTurn;
    if (!currentlyMySide && position === board.pits) {
        updatedSouthTurn = board.southTurn;
        moveType = MoveType.ExtraMove;
    }

    // Prepare the new pit arrays and store values
    const newSouthPits = board.southTurn ? myPits : hisPits;
    const newNorthPits = board.southTurn ? hisPits : myPits;
    let newSouthStore = board.southTurn ? updatedMyStore : board.southStore;
    let newNorthStore = board.southTurn ? board.northStore : updatedMyStore;

    // Check if the game is over
    const sum = (a: number, b: number) => a + b;
    const southSum = newSouthPits.reduce(sum);
    const northSum = newNorthPits.reduce(sum);
    let gameOver = false;

    if (southSum === 0 || northSum === 0) {
        newSouthStore += southSum;
        newNorthStore += northSum;
        newSouthPits.fill(0);
        newNorthPits.fill(0);
        gameOver = true;
    }

    // Return a new BoardPosition instance with the updated state
    const newBoard = {
        pits: board.pits,
        southPits: newSouthPits,
        northPits: newNorthPits,
        southStore: newSouthStore,
        northStore: newNorthStore,
        southTurn: updatedSouthTurn,
        gameOver: gameOver
    };

    return {board: newBoard, moveType: moveType};
}