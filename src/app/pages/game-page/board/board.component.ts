import {NgStyle} from "@angular/common";
import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

import {BoardPosition} from "../../../models/board-position.model";
import {BoardState} from "../../../models/board-state.model";
import {PlayerType} from "../../../models/player-type.enum";
import {playerAttemptsMove} from "../../../stores/board-state/board-state.actions";
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

    protected board!: BoardPosition;

    protected playerSouth!: PlayerType;
    protected playerNorth!: PlayerType;

    startParamsStore = inject(StartParamsStore);

    constructor(
            private router: Router,
            private store: Store<{ boardState: BoardState }>
    ) {
        store.select('boardState').subscribe((state) => {
            this.board = state.boardPosition;
        });
    }


    ngOnInit() {
        if (!this.startParamsStore.defined()) {
            this.router.navigate(['/start']);
        }

        const startParams = this.startParamsStore.startParams();
        this.playerSouth = startParams.playerSouth;
        this.playerNorth = startParams.playerNorth;

    }

    move(position: number, onSouthSide: boolean) {
        console.log('move', position, onSouthSide);
        this.store.dispatch(playerAttemptsMove({move: position, onSouthSide}));
    }

    getIndexArray(size: number) {
        return Array(size).fill(0).map((e, i) => i);
    }

}
