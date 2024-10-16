import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {forkJoin, map, Observable, of, tap, timer} from "rxjs";
import {catchError} from 'rxjs/operators';

import {BoardPosition} from "../models/board-position.model";
import {ComMoveRequest, ComMoveResponse} from "../models/COM.models";
import {PlayerType} from "../models/player-type.enum";

@Injectable({
    providedIn: 'root'
})
export class ComMoveService {

    constructor(private http: HttpClient) {
    }

    requestMove(boardPosition: BoardPosition, playerType: PlayerType): Observable<number | null> {
        const request: ComMoveRequest = {
            playerType: playerType,
            boardPosition: boardPosition
        };

        // ensure that the backend call takes at least 1 second
        const backendCall$ = this.http.post<ComMoveResponse | null>("http://localhost:9090/api/computerMove", request).pipe(
            catchError((error) => {
                console.error("Error when communicating with the backend. Make sure it is running. ", error);
                return of(null);
            })
        );

        const minDelay$ = timer(1000);

        // wait for both, but only return the response
        return forkJoin([backendCall$, minDelay$]).pipe(
            map(([response]) => response),
            tap((x: ComMoveResponse | null) => {
                if (x) {
                    console.log("Computer \"" + playerType + "\" commented\n" + x.comment);
                }
            }),
            map((x: ComMoveResponse | null) => x ? x.move : null)
        );
    }

}
