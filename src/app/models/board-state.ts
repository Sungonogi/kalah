/*
    represents one state of the board
 */

export interface BoardState {
    size: number, // size of southPits and northPits
    southPits: number[],
    northPits: number[],
    southStore: number,
    northStore: number,
    southTurn: boolean, // true if south has the turn
}