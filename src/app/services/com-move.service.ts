import {Injectable} from '@angular/core';
import {forkJoin, Observable, timer} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment as env} from '../../environments/environment';
import {BoardPosition} from '../models/board-position.model';
import {ComMoveRequest} from '../models/COM.models';
import {PlayerType} from '../models/player-type.enum';
import {WasmService} from './wasm.service';


@Injectable({
    providedIn: 'root'
})
export class ComMoveService {
    constructor(private wasmService: WasmService) {}

    requestMove(boardPosition: BoardPosition, playerType: PlayerType): Observable<number | null> {
        const request: ComMoveRequest = {
            playerType: playerType,
            boardPosition: boardPosition,
            timeLimit: env.engineTimeLimit
        };

        const move$ = this.wasmService.askForMove(request);

        // wait at least env.minimumWaitTime milliseconds if the computer is too fast
        return forkJoin([move$, timer(env.minimumWaitTime)]).pipe(
            map(([response, _]) => {
                if (!response) {
                    return null;
                }
        
                console.log(playerType + ": " + response.comment);
                return response.move;
            })
        );
    
    }
}