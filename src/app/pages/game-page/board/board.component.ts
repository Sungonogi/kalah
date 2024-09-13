import {NgStyle} from "@angular/common";
import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";

import {BoardState} from "../../../models/board.state";
import {BoardService} from "../../../services/board.service";
import {StartParamsStore} from "../../../stores/start-params/start-params.store";
import {PitComponent} from "./pit/pit.component";
import {PlayerType} from "../../../models/player-type.enum";

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
    protected boardState!: WritableSignal<BoardState>;

    protected playerSouth!: PlayerType;
    protected playerNorth!: PlayerType;

    startParamsStore = inject(StartParamsStore);

    constructor(private router: Router) {
    }

    ngOnInit() {
        if(!this.startParamsStore.defined()){
            this.router.navigate(['/start']);
        }

        const startParams = this.startParamsStore.startParams();
        this.playerSouth = startParams.playerSouth;
        this.playerNorth = startParams.playerNorth;
        this.boardService.init(startParams);

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
