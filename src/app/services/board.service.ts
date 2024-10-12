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
    kill!: boolean; // to stop the game when the board component is destroyed

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
        this.kill = false;

        this.checkAndPerformComMove();
    }

    // checks if the computer has the next move and if yes does the move
    checkAndPerformComMove(){

        if(this.kill || this.moveRequested)
            return;

        const boardPosition = this.boardPosition();
        if(boardPosition.gameOver)
            return;


        const player = boardPosition.southTurn ? this.playerSouth : this.playerNorth;
        if(player === PlayerType.Local)
            return;

        this.moveRequested = true;
        this.comMoveService.requestMove(boardPosition, player).subscribe(move => {
            this.boardPosition.set(performLegalMove(boardPosition, move));

            this.moveRequested = false;
            this.checkAndPerformComMove();
        });
    }

    // boardPosition is optional, if not provided the current boardPosition is used
    movePossible(move: number, onSouthSide: boolean, boardPosition: BoardPosition | undefined = undefined): boolean {
        if(!boardPosition) {
            boardPosition = this.boardPosition();
        }

        if(boardPosition.gameOver){
            return false;
        }

        const player = onSouthSide ? this.playerSouth : this.playerNorth;
        if(player !== PlayerType.Local){
            return false;
        }

        if(boardPosition.southTurn !== onSouthSide){
            return false;
        }

        return checkLegalMove(boardPosition, move, onSouthSide);
    }

    playerAttemptsMove(move: number, onSouthSide: boolean): void {

        const boardPosition = this.boardPosition();

        if(!this.movePossible(move, onSouthSide, boardPosition)){
            return;
        }

        const newPosition = performLegalMove(boardPosition, move);
        this.boardPosition.set(newPosition);

        this.checkAndPerformComMove();
    }

    stopGame(): void {
        // don't request moves anymore (otherwise games between coms will keep going on)
        this.kill = true;
    }


}
