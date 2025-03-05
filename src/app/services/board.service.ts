import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Subscription} from "rxjs";

import {environment as env} from '../../environments/environment';
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

    startParamsStore = inject(StartParamsStore);

    // will be assigned in the resetBoard method
    playerSouth!: PlayerType;
    playerNorth!: PlayerType;
    boardPosition!: WritableSignal<BoardPosition>;
    animatedBoardPosition!: WritableSignal<BoardPosition>;

    moveRequestSubscription: Subscription | undefined = undefined;

    // use ReturnType of SetTimeout for platform independence
    animationTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

    constructor(
            private comMoveService: ComMoveService,
            private audioService: AudioService
    ) {
    }

    // has to be called before any other functions
    resetBoard(): void {
        this.resetCallbacks();

        this.playerSouth = this.startParamsStore.playerSouth();
        this.playerNorth = this.startParamsStore.playerNorth();

        const pits = this.startParamsStore.pits();
        const seeds = this.startParamsStore.seeds();

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

        this.audioService.startAudio();

        // wait a little but not as long as the audio
        this.animationTimeout = setTimeout(this.checkAndPerformComMove.bind(this), env.gameStartTime);
    }

    resetCallbacks(){
        if(this.moveRequestSubscription !== undefined){
            this.moveRequestSubscription.unsubscribe();
            this.moveRequestSubscription = undefined;
        }

        if(this.animationTimeout !== undefined){
            this.animationTimeout = undefined;
        }
    }

    // checks if the computer has the next move and if yes does the move
    checkAndPerformComMove() {

        if (this.moveRequestSubscription !== undefined)
            return;

        const boardPosition = this.boardPosition();
        if (boardPosition.gameOver)
            return;


        const player = boardPosition.southTurn ? this.playerSouth : this.playerNorth;
        if (player === PlayerType.Local)
            return;


        this.moveRequestSubscription = this.comMoveService.requestMove(boardPosition, player).subscribe(move => {

            this.moveRequestSubscription = undefined;

            if(move === null){
                return;
            }

            this.doLegalMove(move);
            this.checkAndPerformComMove();
        });
    }

    movePossible(move: number, onSouthSide: boolean): boolean {

        const boardPosition = this.boardPosition();

        // only allow moves after the animation is finished, comparison by reference works as it is actually the same
        if(boardPosition !== this.animatedBoardPosition()){
            return false;
        }

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

        if(this.animationTimeout){
            clearTimeout(this.animationTimeout);
        }

        if (result.moveType === MoveType.CaptureMove) {
            const waitTime = this.audioService.moveAudio();
            this.animationTimeout = setTimeout(() => {
                this.audioService.stealAudio();
                this.animatedBoardPosition.set(result.boards[1]);
                this.checkGameOverAndComMove(result.boards);
            }, waitTime);
        } else {
            // only play extra move sound if extra move and not game over
            const waitTime = this.audioService.moveAudio();
            if(result.moveType === MoveType.ExtraMove && result.boards.length === 1){
                this.animationTimeout = setTimeout(() => {
                    this.audioService.extraAudio();
                }, waitTime);
            }   
            this.checkGameOverAndComMove(result.boards);
        }
    }

    private checkGameOverAndComMove(boards: BoardPosition[]) {
        const lastBoard = boards[boards.length - 1];
        if (lastBoard.gameOver) {
            this.animationTimeout = setTimeout(() => {
                this.animatedBoardPosition.set(lastBoard);
                this.audioService.endAudio();
            }, env.gameOverAnimationTime);
        } else {
            this.checkAndPerformComMove();
        }
    }

    public isBoardUntouched(): boolean {
        const board = this.boardPosition();
        const southUntouched = board.southPits.every((val, _, arr) => val === arr[0]);
        const northUntouched = board.northPits.every((val, _, arr) => val === arr[0]);
        const storesUntouched = board.southStore === 0 && board.northStore === 0;
        return southUntouched && northUntouched && storesUntouched;
    }

}
