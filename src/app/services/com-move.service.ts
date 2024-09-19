import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';

import {BoardPosition} from "../models/board-position.model";
import {ComMoveRequest} from "../models/COM-move-request.model";
import {PlayerType} from "../models/player-type.enum";
import {delay} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ComMoveService {

    constructor(private http: HttpClient) {
    }
  
    requestMove(boardPosition: BoardPosition, playerType: PlayerType) {
        const request: ComMoveRequest = {
            playerType: playerType,
            boardPosition: boardPosition
        };
        return this.http.post<number>("http://localhost:9090/api/computerMove", request).pipe(
            delay(500)
        );
    }

}
