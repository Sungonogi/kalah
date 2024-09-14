import {BoardPosition} from "./board-position.class";
import {PlayerType} from "./player-type.enum";

/*
    not only the logical position of the board but also other relevant data for the application
 */

export interface BoardState {
    initialized: boolean,
    waitingForCPU: boolean,
    gameOver: boolean,
    playerSouth: PlayerType,
    playerNorth: PlayerType,
    boardPosition: BoardPosition,
}