import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, timer } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WasmService } from './wasm.service';
import { PlayerType } from '../models/player-type.enum';
import { BoardPosition } from '../models/board-position.model';
import { ComMoveRequest, ComMoveResponse } from '../models/COM.models';

@Injectable({
  providedIn: 'root'
})
export class ComMoveService {
  constructor(private wasmService: WasmService, private http: HttpClient) {}

  requestMove(boardPosition: BoardPosition, playerType: PlayerType): Observable<number | null> {
    const request: ComMoveRequest = {
      playerType: playerType,
      boardPosition: boardPosition
    };

    // adjust these as wanted
    const wasm = playerType !== PlayerType.Stickfish;
    const maxTime = false;

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

    const handleResponse = (response: ComMoveResponse | null) => {
        if (!response) {
            return null;
        }
    
        console.log(response.comment);
        return response.move;
    }

    if (maxTime) {
      // wait at least 800ms
      return forkJoin([move$, timer(800)]).pipe(
        map(([response, _]) => handleResponse(response))
      );
    } else {
      return move$.pipe(
        map((response) => handleResponse(response))
      );
    }
    
  }
}