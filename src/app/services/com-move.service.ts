import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {forkJoin, map, Observable, timer} from "rxjs";

import {BoardPosition} from "../models/board-position.model";
import {ComMoveRequest} from "../models/COM-move-request.model";
import {PlayerType} from "../models/player-type.enum";

@Injectable({
    providedIn: 'root'
})
export class ComMoveService {

    constructor(private http: HttpClient) {
    }
  
    requestMove(boardPosition: BoardPosition, playerType: PlayerType): Observable<number> {
        const request: ComMoveRequest = {
            playerType: playerType,
            boardPosition: boardPosition
        };

        // ensure that the backend call takes at least 1 second
        const backendCall$ = this.http.post<number>("http://localhost:9090/api/computerMove", request);
        const minDelay$ = timer(1000);

        // wait for both, but only return the response
        return forkJoin([backendCall$, minDelay$]).pipe(
            map(([response]) => response)
        );
    }

}
