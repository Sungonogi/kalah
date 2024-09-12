import {PlayerType} from "./player-type.enum";

export interface StartParams {
    playerSouth: PlayerType
    playerNorth: PlayerType;
    seeds: number;
    pits: number;
}