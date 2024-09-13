import {NgStyle} from "@angular/common";
import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";

import {BoardStateModel} from "../../../models/board-state.model";
import {BoardService} from "../../../services/board.service";
import {StartParamsStore} from "../../../stores/start-params/start-params.store";
import {PitComponent} from "./pit/pit.component";

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
    protected boardState: WritableSignal<BoardStateModel> | undefined;

    startParamsStore = inject(StartParamsStore);

    constructor(private router: Router) {
    }

    ngOnInit() {
        if(!this.startParamsStore.defined()){
            this.router.navigate(['/start']);
        }

        const startParams = this.startParamsStore.startParams();

        this.boardService.init(startParams.pits, startParams.seeds);
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
