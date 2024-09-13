import {Injectable, signal, WritableSignal} from '@angular/core';

import {BoardState} from "../models/board.state";
import {PlayerType} from "../models/player-type.enum";
import {StartParams} from "../models/start-params.model";
import {BotService} from "./bot.service";

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    private board!: WritableSignal<BoardState>;
    private southTurnToPlayerType = new Map<boolean, string>();

    constructor(private botService: BotService) {
    }

    init(startParams: StartParams) {
        this.board = signal({
            pits: startParams.pits,
            southPits: Array(startParams.pits).fill(startParams.seeds),
            northPits: Array(startParams.pits).fill(startParams.seeds),
            southStore: 0,
            northStore: 0,
            southTurn: true
        });

        this.southTurnToPlayerType.set(true, startParams.playerSouth);
        this.southTurnToPlayerType.set(false, startParams.playerNorth);
    }

    getBoardState(): WritableSignal<BoardState> {
        if(!this.board)
            throw new Error('Board state not initialized');

        return this.board;
    }

    doMove(position: number, onSouthSide: boolean) {
        if(!this.board)
            throw new Error('Board state not initialized');

        const board = structuredClone(this.board());
        if(this.southTurnToPlayerType.get(board.southTurn) !== PlayerType.Local){
            console.error('Not your turn');
            return;
        }

        const myPits = onSouthSide ? board.southPits : board.northPits;
        if(myPits[position] === 0) {
            console.error('No seeds in pit');
            return;
        }

        const hisPits = onSouthSide ? board.northPits : board.southPits;
        const myStore = onSouthSide ? 'southStore' : 'northStore';

        let currentlyMySide = true;
        let hand = myPits[position];
        myPits[position] = 0;

        while(hand > 0){
            position = (position + 1) % (board.pits + 1);

            if(position < board.pits){
                hand--;
                if(currentlyMySide){
                    myPits[position]++;
                } else {
                    hisPits[position]++;
                }
            } else {
                // only put in our own store,  otherwise skip
                if(currentlyMySide){
                    hand--;
                    board[myStore]++;
                }
                currentlyMySide = !currentlyMySide;
            }
        }

        // check for steal
        const mirrored = board.pits - position - 1;
        if(currentlyMySide && myPits[position] === 1 && hisPits[mirrored] > 0) {
            board[myStore] += myPits[position] + hisPits[mirrored];
            myPits[position] = 0;
            hisPits[mirrored] = 0;
        }

        // don't swap sides if the last stone lands in our store (in that case currentlyMySide was already set to false)
        if(currentlyMySide || position !== board.pits) {
            board.southTurn = !board.southTurn;
        }

        // check if the game is over
        const sum = (a: number, b: number) => a + b;
        const southSum = board.southPits.reduce(sum);
        const northSum = board.northPits.reduce(sum);
        const gameOver = southSum === 0 || northSum === 0;
        if(gameOver){
            board.northStore += northSum;
            board.northPits.fill(0);
            board.southStore += southSum;
            board.southPits.fill(0);
        }

        this.board.update(() => board);

        // if the game is not over we have to let the bot move
        const nextPlayer = this.southTurnToPlayerType.get(board.southTurn) as PlayerType;
        if(!gameOver && nextPlayer !== PlayerType.Local){
            this.botService.requestMove(board, nextPlayer).then(move => this.doMove(move, board.southTurn));
        }

    }


}
