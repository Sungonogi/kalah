import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';

import {BoardState} from "../models/board-state.model";
import {ComMoveRequest} from "../models/COM-move-request.model";
import {PlayerType} from "../models/player-type.enum";

@Injectable({
    providedIn: 'root'
})
export class ComputerMoveService {

    constructor(private http: HttpClient) {
    }

    requestMove(boardState: BoardState, playerType: PlayerType) {
        if (playerType === PlayerType.Local) {
            console.error('Local player has to decide by himself :D');
        }

        const request: ComMoveRequest = {
            playerType: playerType,
            boardState: boardState
        };

        return this.http.post<number>("http://localhost:9090/api/computerMove", request);
    }
}
