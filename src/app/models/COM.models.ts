import {BoardPosition} from "./board-position.model";
import {PlayerType} from "./player-type.enum";

export interface ComMoveRequest {
    playerType: PlayerType;
    boardPosition: BoardPosition
    maxDepth?: number; // Optional parameter for some COMs, only really used for speed testing
}

export interface ComMoveResponse {
    move: number;
    comment: string;
}