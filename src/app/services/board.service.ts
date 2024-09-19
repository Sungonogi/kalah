import {effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';

import {checkLegalMove, performLegalMove} from "../models/board-position.helpers";
import {BoardPosition} from "../models/board-position.model";
import {PlayerType} from "../models/player-type.enum";
import {StartParamsStore} from "../stores/start-params/start-params.store";
import {ComMoveService} from "./com-move.service";

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    startParams = inject(StartParamsStore);

    playerSouth: Signal<PlayerType>;
    playerNorth: Signal<PlayerType>;

    boardPosition: WritableSignal<BoardPosition>;

    constructor(private comMoveService: ComMoveService) {

        this.playerNorth = this.startParams.playerNorth;
        this.playerSouth = this.startParams.playerSouth;

        const pits = this.startParams.pits();
        const seeds = this.startParams.seeds();

        const boardPosition = {
            pits: pits,
            southPits: Array(pits).fill(seeds),
            northPits: Array(pits).fill(seeds),
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        };
        this.boardPosition = signal(boardPosition);

        effect(() => {
            // Com move
            const boardPosition = this.boardPosition();

            const player = boardPosition.southTurn ? this.playerSouth() : this.playerNorth();
            console.log('player', player);
            if(player !== PlayerType.Local){
                this.comMoveService.requestMove(boardPosition, player).subscribe(move => {
                    this.boardPosition.set(performLegalMove(boardPosition, move));
                });
            }

        });
    }

    resetBoard(): void {
        const pits = this.startParams.pits();
        const seeds = this.startParams.seeds();

        const boardPosition = {
            pits: pits,
            southPits: Array(pits).fill(seeds),
            northPits: Array(pits).fill(seeds),
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        };
        this.boardPosition.set(boardPosition);
    }

    playerAttemptsMove(move: number, onSouthSide: boolean): void {

        const boardPosition = this.boardPosition();

        if(boardPosition.gameOver){
            console.error('Game over');
            return;
        }

        const player = onSouthSide ? this.playerSouth() : this.playerNorth();
        if(player !== PlayerType.Local){
            console.error('Not your side');
            return;
        }

        if(boardPosition.southTurn !== onSouthSide){
            console.error('Not your turn');
            return;
        }

        const legal = checkLegalMove(boardPosition, move, onSouthSide);
        if(!legal){
            console.error('Illegal move');
            return;
        }

        this.boardPosition.set(performLegalMove(boardPosition, move));
    }


}
