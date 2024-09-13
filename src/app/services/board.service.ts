import {Injectable, signal, WritableSignal} from '@angular/core';

import {BoardStateModel} from "../models/board-state.model";

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    private board!: WritableSignal<BoardStateModel>;

    init(size: number, seeds: number) {
        this.board = signal({
            size: size,
            southPits: Array(size).fill(seeds),
            northPits: Array(size).fill(seeds),
            southStore: 0,
            northStore: 0,
            southTurn: true
        });
    }

    getBoardState(): WritableSignal<BoardStateModel> {
        if(!this.board)
            throw new Error('Board state not initialized');

        return this.board;
    }

    doMove(position: number, onSouthSide: boolean) {
        if(!this.board)
            throw new Error('Board state not initialized');

        const board = structuredClone(this.board());
        if(board.southTurn !== onSouthSide) {
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
            position = (position + 1) % (board.size + 1);

            if(position < board.size){
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
        const mirrored = board.size - position - 1;
        if(currentlyMySide && myPits[position] === 1 && hisPits[mirrored] > 0) {
            board[myStore] += myPits[position] + hisPits[mirrored];
            myPits[position] = 0;
            hisPits[mirrored] = 0;
        }

        // don't swap sides if the last stone lands in our store (in that case currentlyMySide was already set to false)
        if(currentlyMySide || position !== board.size) {
            board.southTurn = !board.southTurn;
        }

        // check if the game is over
        const sum = (a: number, b: number) => a + b;
        const southSum = board.southPits.reduce(sum);
        const northSum = board.northPits.reduce(sum);
        if(southSum === 0){
            board.northStore += northSum;
            board.northPits.fill(0);
        }
        if(northSum === 0){
            board.southStore += southSum;
            board.southPits.fill(0);
        }

        this.board.update(() => board);
    }


}
