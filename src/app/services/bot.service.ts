import {Injectable} from '@angular/core';

import {BoardState} from "../models/board.state";
import {PlayerType} from "../models/player-type.enum";

@Injectable({
    providedIn: 'root'
})
export class BotService {


    async requestMove(boardState: BoardState, playerType: PlayerType) {
        if (playerType === PlayerType.Local) {
            console.error('Local player has to decide by himself :D');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        return Math.floor(Math.random() * boardState.pits);
    }
}
