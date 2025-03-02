import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable, of, timer} from 'rxjs';
import {catchError,map} from 'rxjs/operators';

import {environment as env} from '../../environments/environment';
import {BoardPosition} from '../models/board-position.model';
import {ComMoveRequest, ComMoveResponse} from '../models/COM.models';
import {PlayerType} from '../models/player-type.enum';
import {WasmService} from './wasm.service';


@Injectable({
    providedIn: 'root'
})
export class ComMoveService {
    constructor(private wasmService: WasmService, private http: HttpClient) {}

    requestMove(boardPosition: BoardPosition, playerType: PlayerType): Observable<number | null> {
        const request: ComMoveRequest = {
            playerType: playerType,
            boardPosition: boardPosition,
            timeLimit: env.engineTimeLimit
        };

        // adjust these as wanted
        const wasm = playerType !== PlayerType.Stickfish;

        let move$: Observable<ComMoveResponse | null>;

        if (wasm) {
            move$ = this.wasmService.askForMove(request);
        } else {
            move$ = this.http.post<ComMoveResponse | null>("http://localhost:9090/api/computerMove", request).pipe(
                catchError((error) => {
                    console.error("Error when communicating with the backend. Make sure it is running. ", error);
                    return of(null);
                }),
            );
        }

        // wait at least env.minimumWaitTime milliseconds if the computer is too fast
        return forkJoin([move$, timer(env.minimumWaitTime)]).pipe(
            map(([response, _]) => {
                if (!response) {
                    return null;
                }
        
                console.log(response.comment);
                return response.move;
            })
        );
    
    }
}