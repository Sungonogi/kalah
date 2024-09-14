import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, filter, map, switchMap} from 'rxjs/operators';

import {BoardState} from '../../models/board-state.model';

@Injectable()
export class BoardStateEffects {

    constructor(
            private actions$: Actions,
            private http: HttpClient
    ) {
    }

    waitingForCPUEffect$ = createEffect(() => this.actions$.pipe(
        ofType('[Board State] playerAttemptsMove'),
        filter((state: BoardState) => state.waitingForCPU),
        switchMap((state: BoardState) => {
            const request = {
                boardPosition: state.boardPosition,
                playerType: state.boardPosition.southTurn ? state.playerSouth : state.playerNorth
            };
            return this.http.post<number>('http://localhost:9090/api/computerMove', request).pipe(
                map((move: number) => ({type: '[Board State] comMove', move})),
                catchError((error) => {
                    console.error('Error fetching computer move', error);
                    return EMPTY;
                })
            );
        })
    ));

}