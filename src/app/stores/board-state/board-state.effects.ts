import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from "@ngrx/store";
import {EMPTY, withLatestFrom} from 'rxjs';
import {catchError, filter, map, switchMap} from 'rxjs/operators';

import {BoardState} from '../../models/board-state.model';

@Injectable()
export class BoardStateEffects {

    private actions$ = inject(Actions);

    constructor(
            private http: HttpClient,
    ) {
    }

    waitingForCPUEffect$ = createEffect(() => this.actions$.pipe(
        ofType('[Board State] playerAttemptsMove'),
        withLatestFrom(inject( Store<{ boardState: BoardState }>).select('boardState')),
        filter(([, state]) => state.waitingForCPU),
        switchMap(([, state]) => {
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