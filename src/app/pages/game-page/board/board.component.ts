import {NgStyle} from "@angular/common";
import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    QueryList,     Signal,
signal,
    ViewChildren,
    WritableSignal
} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {Router, RouterLink} from "@angular/router";

import {BoardPosition} from "../../../models/board-position.model";
import {PlayerType} from "../../../models/player-type.enum";
import {BoardService} from "../../../services/board.service";
import {StartParamsStore} from "../../../stores/start-params/start-params.store";
import {GameOverDialogComponent} from "./game-over-dialog/game-over-dialog.component";
import {PitComponent} from "./pit/pit.component";
import {StoneManagerComponent} from "./stone-manager/stone-manager.component";

export interface DialogData {
    board: BoardPosition;
    playerSouth: PlayerType;
    playerNorth: PlayerType;
}

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [
        PitComponent,
        NgStyle,
        MatButton,
        RouterLink,
        StoneManagerComponent
    ],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {

    protected boardSignal!: Signal<BoardPosition>;

    protected totalStones!: number;
    protected playerSouth!: PlayerType;
    protected playerNorth!: PlayerType;

    startParamsStore = inject(StartParamsStore);

    protected pitPositions: WritableSignal<{x: number, y: number}[] | undefined>  = signal(undefined);
    @ViewChildren('pitElement') pitElements!: QueryList<PitComponent>;

    constructor(
            private boardService: BoardService,
            private matDialog: MatDialog,
            private router: Router
    ) {

        effect(() => {
            const board = this.boardSignal();
            if(board.gameOver){

                const dialogRef = this.matDialog.open(GameOverDialogComponent, {
                    data: {
                        board: board,
                        playerSouth: this.playerSouth,
                        playerNorth: this.playerNorth
                    }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if(result){
                        this.boardService.resetBoard();
                    } else {
                        this.router.navigate(["start"]);
                    }
                });

            }
        });

    }


    ngOnInit() {
        this.boardService.resetBoard();

        this.boardSignal = this.boardService.boardPosition;
        this.playerSouth = this.startParamsStore.playerSouth();
        this.playerNorth = this.startParamsStore.playerNorth();
        this.totalStones = 2 * this.startParamsStore.seeds() *  this.startParamsStore.pits();
    }

    ngAfterViewInit() {
        this.updatePitPositions();
    }

    ngOnDestroy() {
        this.boardService.stopGame();
    }

    move(position: number, onSouthSide: boolean) {
        this.boardService.playerAttemptsMove(position, onSouthSide);
    }

    getIndexArray(size: number) {
        return Array(size).fill(0).map((e, i) => i);
    }


    updatePitPositions(){
        const positions = this.pitElements.map(pit => pit.getCenterPosition());

        console.log("updating pit positions", positions);

        this.pitPositions.set(positions);
    }
}
