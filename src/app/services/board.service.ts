import {inject, Injectable, signal, WritableSignal} from '@angular/core';

import {checkLegalMove, performLegalMove} from "../models/board-position.helpers";
import {BoardPosition} from "../models/board-position.model";
import {MoveType} from "../models/move-type.enum";
import {PlayerType} from "../models/player-type.enum";
import {StartParamsStore} from "../stores/start-params/start-params.store";
import {AudioService} from "./audio.service";
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
    animatedBoardPosition!: WritableSignal<BoardPosition>;

    moveRequested!: boolean; // to avoid multiple calls at once
    duringAnimation!: boolean; // to tell if we are currently animating something

    kill!: boolean; // to stop the game when the board component is destroyed
    ignore!: boolean; // to ignore the requested move after a reset

    constructor(
            private comMoveService: ComMoveService,
            private audioService: AudioService
    ) {
    }

    // has to be called before any other functions
    resetBoard(): void {
        this.audioService.startAudio();

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
            gameOver: false,
        };

        if (!this.boardPosition) {
            this.boardPosition = signal(boardPosition);
            this.animatedBoardPosition = signal(boardPosition);
        } else {
            this.boardPosition.set(boardPosition);
            this.animatedBoardPosition.set(boardPosition);
        }

        // ignore the requested move or animations after a reset
        this.ignore = this.moveRequested;
        this.duringAnimation = false;
        this.moveRequested = false;
        this.kill = false;

        this.checkAndPerformComMove();
    }

    // checks if the computer has the next move and if yes does the move
    checkAndPerformComMove() {

        if (this.kill || this.moveRequested)
            return;

        const boardPosition = this.boardPosition();
        if (boardPosition.gameOver)
            return;


        const player = boardPosition.southTurn ? this.playerSouth : this.playerNorth;
        if (player === PlayerType.Local)
            return;

        this.moveRequested = true;
        this.comMoveService.requestMove(boardPosition, player).subscribe(move => {
            if(this.ignore){
                this.ignore = false;
                this.moveRequested = false;
                return;
            }

            if (this.kill || move === null)
                return;

            this.moveRequested = false;
            this.doLegalMove(move);
            this.checkAndPerformComMove();
        });
    }

    moveLegal(move: number, onSouthSide: boolean): boolean {

        const boardPosition = this.boardPosition();


        if (boardPosition.gameOver) {
            return false;
        }

        const player = onSouthSide ? this.playerSouth : this.playerNorth;
        if (player !== PlayerType.Local) {
            return false;
        }

        if (boardPosition.southTurn !== onSouthSide) {
            return false;
        }

        return checkLegalMove(boardPosition, move, onSouthSide);
    }

    doLegalMove(move: number): void {
        const boardPosition = this.boardPosition();

        const result = performLegalMove(boardPosition, move);

        // already set it to the last position
        this.boardPosition.set(result.boards[result.boards.length - 1]);
        this.animatedBoardPosition.set(result.boards[0]);

        if (result.moveType === MoveType.CaptureMove) {
            this.duringAnimation = true;
            this.audioService.moveAudio(() => {

                if(!this.duringAnimation)
                    return; // someone wants us to stop

                this.audioService.stealAudio();
                this.animatedBoardPosition.set(result.boards[1]);
                this.checkGameOver(result.boards);
            });
        } else if (result.moveType === MoveType.ExtraMove) {
            this.duringAnimation = true;
            this.audioService.moveAudio(() => {
                if(!this.duringAnimation)
                    return; // someone wants us to stop

                // no sound if game ends
                if(result.boards.length === 1) {
                    this.audioService.extraAudio();
                }
                this.checkGameOver(result.boards);
            });
        } else {
            this.audioService.moveAudio(() => false);
            this.checkGameOver(result.boards);
        }


        this.checkAndPerformComMove();
    }

    private checkGameOver(boards: BoardPosition[]) {
        const lastBoard = boards[boards.length - 1];
        if (lastBoard.gameOver) {
            this.duringAnimation = true;
            setTimeout(() => {
                if(!this.duringAnimation)
                    return;

                this.audioService.endAudio();
                this.animatedBoardPosition.set(lastBoard);
                this.duringAnimation = false;
            }, 500);
        } else {
            this.duringAnimation = false;
        }
    }

    stopGame(): void {
        // don't request moves anymore (otherwise games between coms will keep going on)
        this.kill = true;
    }


}
