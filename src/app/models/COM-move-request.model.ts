import {BoardState} from "./board-state.model";
import {PlayerType} from "./player-type.enum";

export interface ComMoveRequest {
    playerType: PlayerType;
    boardState: BoardState
}