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
