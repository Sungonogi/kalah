import {BoardPosition} from "./board-position.model";
import {PlayerType} from "./player-type.enum";

export interface ComMoveRequest {
    playerType: PlayerType;
    boardPosition: BoardPosition
    // One of the following two fields has to be set for hard COMs
    maxDepth?: number; 
    timeLimit?: number; // in milliseconds
}

export interface ComMoveResponse {
    move: number;
    comment: string;
}