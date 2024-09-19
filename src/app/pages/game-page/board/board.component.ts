import {NgStyle} from "@angular/common";
import {Component, effect, inject, OnInit} from '@angular/core';

import {BoardPosition} from "../../../models/board-position.model";
import {PlayerType} from "../../../models/player-type.enum";
import {BoardService} from "../../../services/board.service";
import {StartParamsStore} from "../../../stores/start-params/start-params.store";
import {PitComponent} from "./pit/pit.component";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [
        PitComponent,
        NgStyle,
        MatButton,
        RouterLink
    ],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

    protected board!: BoardPosition;

    protected playerSouth!: PlayerType;
    protected playerNorth!: PlayerType;

    startParamsStore = inject(StartParamsStore);

    constructor(private boardService: BoardService) {

        effect(() => {
            this.board = this.boardService.boardPosition();
        });

    }


    ngOnInit() {
        this.boardService.resetBoard();
        this.playerSouth = this.startParamsStore.playerSouth();
        this.playerNorth = this.startParamsStore.playerNorth();
    }

    move(position: number, onSouthSide: boolean) {
        this.boardService.playerAttemptsMove(position, onSouthSide);
    }

    getIndexArray(size: number) {
        return Array(size).fill(0).map((e, i) => i);
    }

}
