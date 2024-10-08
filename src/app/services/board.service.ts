import {inject, Injectable, signal, WritableSignal} from '@angular/core';

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

    // will be assigned in the resetBoard method
    playerSouth!: PlayerType;
    playerNorth!: PlayerType;
    boardPosition!: WritableSignal<BoardPosition>;
    moveRequested!: boolean; // to avoid multiple calls at once

    constructor(private comMoveService: ComMoveService) {
    }

    // has to be called before any other functions
    resetBoard(): void {
        this.playerSouth = this.startParams.playerSouth();
        this.playerNorth = this.startParams.playerNorth();

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

        if(!this.boardPosition){
            this.boardPosition = signal(boardPosition);
        } else {
            this.boardPosition.set(boardPosition);
        }

        this.moveRequested = false;
        this.checkAndPerformComMove();
    }

    // checks if the computer has the next move and if yes does the move
    checkAndPerformComMove(){
        const boardPosition = this.boardPosition();

        const player = boardPosition.southTurn ? this.playerSouth : this.playerNorth;

        if(!boardPosition.gameOver && player !== PlayerType.Local && !this.moveRequested){
            this.moveRequested = true;
            this.comMoveService.requestMove(boardPosition, player).subscribe(move => {
                this.boardPosition.set(performLegalMove(boardPosition, move));

                this.moveRequested = false;
                this.checkAndPerformComMove();
            });
        }
    }

    playerAttemptsMove(move: number, onSouthSide: boolean): void {

        const boardPosition = this.boardPosition();

        if(boardPosition.gameOver){
            console.error('Game over');
            return;
        }

        const player = onSouthSide ? this.playerSouth : this.playerNorth;
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

        const newPosition = performLegalMove(boardPosition, move);
        this.boardPosition.set(newPosition);

        this.checkAndPerformComMove();
    }


}
