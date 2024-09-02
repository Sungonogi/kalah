import {Component} from '@angular/core';
import {BoardState} from "../../../models/board-state";
import {PitComponent} from "./pit/pit.component";
import {NgStyle} from "@angular/common";

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
export class BoardComponent {

    boardState : BoardState = {
        size: 6,
        southPits: [2, 2, 2, 2, 2, 2],
        northPits: [2, 2, 2, 2, 2, 2],
        southStore: 0,
        northStore: 0,
        southTurn: true
    }

    move(position: number, southSide: boolean) {
        console.log(`Move at position ${position} on ${southSide ? 'south' : 'north'} side`);

        const board = this.boardState;
        if(board.southTurn !== southSide) {
            console.error('Not your turn');
            return;
        }

        const myPits = southSide ? board.southPits : board.northPits;
        const hisPits = southSide ? board.northPits : board.southPits;

        let currentlyMySide = true;
        let hand = myPits[position];
        myPits[position] = 0;

        while(hand > 0){
            position += 1;
            if(position === board.size){
                if(currentlyMySide){
                    hand--;
                    if(southSide){
                        board.southStore++;
                    } else {
                        board.northStore++;
                    }
                }
                position = 0;
                currentlyMySide = !currentlyMySide;
            }

            hand--;
            if(currentlyMySide){
                myPits[position]++;
            } else {
                hisPits[position]++;
            }
        }

        board.southTurn = !board.southTurn;
    }

}
