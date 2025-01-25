import {Injectable} from '@angular/core';
import {forkJoin, map, Observable, timer} from "rxjs";

import {BoardPosition} from "../models/board-position.model";
import {ComMoveRequest, ComMoveResponse} from "../models/COM.models";
import {PlayerType} from "../models/player-type.enum";
import {WasmService} from './wasm.service';

@Injectable({
    providedIn: 'root'
})
export class ComMoveService {

    constructor(private wasmService: WasmService) {
    }

    requestMove(boardPosition: BoardPosition, playerType: PlayerType): Observable<number | null> {
        const request: ComMoveRequest = {
            playerType: playerType,
            boardPosition: boardPosition
        };

        const move = this.wasmService.askForMove(request).pipe(
            map((response: ComMoveResponse) => {
                console.log(`${request.playerType}: ${response.comment}`);
                return response.move;
            })
        );

        // wait at least 800ms
        return forkJoin([move, timer(800)]).pipe(
            map(([move, _]) => move)
        );
    }


}
