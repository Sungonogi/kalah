import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {PitComponent} from "./pit/pit.component";
import {NgStyle} from "@angular/common";
import {BoardService} from "../../../services/board.service";
import {BoardState} from "../../../models/board-state";

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
export class BoardComponent implements OnInit {

    private boardService: BoardService = inject(BoardService);
    protected boardState: WritableSignal<BoardState> | undefined;

    ngOnInit() {
        this.boardService.init(6, 2);
        this.boardState = this.boardService.getBoardState();
    }

    move(position: number, onSouthSide: boolean) {
        console.log('move', position, onSouthSide);
        this.boardService.doMove(position, onSouthSide);
    }

    getIndexArray(size: number) {
        return Array(size).fill(0).map((e,i)=>i);
    }

}
