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
    temporaryPosition: boolean; // true if this is a temporary position for animation, moves arent possible in this state
    captureEndPosition?: number; // the position where the capture ends
}
