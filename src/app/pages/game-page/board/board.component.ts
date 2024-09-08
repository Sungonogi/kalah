import {Component, OnDestroy, OnInit} from '@angular/core';
import {BoardState} from "../../../models/board-state";
import {PitComponent} from "./pit/pit.component";
import {NgStyle} from "@angular/common";
import {WebSocketService} from "../../../services/web-socket.service";

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [
        PitComponent,
        NgStyle
    ],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {

    boardState : BoardState = {
        size: 6,
        southPits: [2, 2, 2, 2, 2, 2],
        northPits: [2, 2, 2, 2, 2, 2],
        southStore: 0,
        northStore: 0,
        southTurn: true
    }

    constructor(private webSocketService: WebSocketService) {
    }

    async ngOnInit() {
        this.webSocketService.init();
        // wait for 1 second
        await new Promise(f => setTimeout(f, 1000));

        this.webSocketService.subscribeToBoardState((boardState: any) => {
            console.log('Received new board state', boardState);
            this.boardState = boardState;
        });
    }

    ngOnDestroy() {
        this.webSocketService.destroy();
    }

    move(position: number, onSouthSide: boolean) {
        console.log(`Move at position ${position} on ${onSouthSide ? 'south' : 'north'} side`);

        this.webSocketService.sendMessage(position);

        const board = this.boardState;
        if(board.southTurn !== onSouthSide) {
            console.error('Not your turn');
            return;
        }

        const myPits = onSouthSide ? board.southPits : board.northPits;
        const hisPits = onSouthSide ? board.northPits : board.southPits;

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
                    if(currentlyMySide === onSouthSide) {
                        board.southStore++;
                    } else {
                        board.northStore++;
                    }
                }
                currentlyMySide = !currentlyMySide;
            }
        }

        // don't swap sides if the last stone lands in our store (in that case currentlyMySide was already set to false)
        if(currentlyMySide || position !== board.size) {
            board.southTurn = !board.southTurn;
        }
    }

}
