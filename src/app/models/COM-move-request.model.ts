import {BoardPosition} from "./board-position.class";
import {PlayerType} from "./player-type.enum";

export interface ComMoveRequest {
    playerType: PlayerType;
    boardState: BoardPosition
}