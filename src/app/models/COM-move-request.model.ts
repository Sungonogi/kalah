import {BoardPosition} from "./board-position.model";
import {PlayerType} from "./player-type.enum";

export interface ComMoveRequest {
    playerType: PlayerType;
    boardState: BoardPosition
}