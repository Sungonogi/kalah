import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";

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

        return this.wasmService.askForMove(request).pipe(
            map((response: ComMoveResponse) => {
                console.log('Comment by Engine ', response.comment);
                return response.move;
            })
        );
    }


}
