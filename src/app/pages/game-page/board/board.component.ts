import {NgStyle} from "@angular/common";
import {
    AfterViewInit,
    Component,
    effect,
    HostListener,
    inject,
    OnDestroy,
    OnInit,
    QueryList,
    Signal,
    signal,
    ViewChild,
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
    protected animatedBoardSignal!: Signal<BoardPosition>;

    protected totalStones!: number;
    protected playerSouth!: PlayerType;
    protected playerNorth!: PlayerType;

    private startParamsStore = inject(StartParamsStore);

    // get the pit elements using ViewChildren
    protected southPitPositions: WritableSignal<{x:number, y: number}[]> = signal([]);
    protected northPitPositions: WritableSignal<{x:number, y: number}[]> = signal([]);
    protected northStorePosition: WritableSignal<{x:number, y: number}> = signal({x: 0, y: 0});
    protected southStorePosition: WritableSignal<{x: number, y: number}>   = signal({x: 0, y: 0});
    protected pitSize: WritableSignal<number> = signal(0);
    protected rendered = false;

    @ViewChildren('northPits') northPitElements!: QueryList<PitComponent>;
    @ViewChildren('southPits') southPitElements!: QueryList<PitComponent>;
    @ViewChild('northStore') northStoreElement!: PitComponent;
    @ViewChild('southStore') southStoreElement!: PitComponent;

    private intervalId : NodeJS.Timeout | undefined = undefined;

    constructor(
            private boardService: BoardService,
            private matDialog: MatDialog,
            private router: Router
    ) {

        effect(() => {
            const board = this.animatedBoardSignal();
            if(board.gameOver){

                // wait 500ms before showing the dialog
                setTimeout(() => {
                    const dialogRef = this.matDialog.open(GameOverDialogComponent, {
                        data: {
                            board: board,
                            playerSouth: this.playerSouth,
                            playerNorth: this.playerNorth
                        }
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.boardService.resetBoard();
                        } else {
                            this.router.navigate(["start"]);
                        }
                    });
                }, 500);

            }
        });

    }


    ngOnInit() {
        this.boardService.resetBoard();

        this.boardSignal = this.boardService.boardPosition;
        this.animatedBoardSignal = this.boardService.animatedBoardPosition;
        this.playerSouth = this.startParamsStore.playerSouth();
        this.playerNorth = this.startParamsStore.playerNorth();
        this.totalStones = 2 * this.startParamsStore.seeds() * this.startParamsStore.pits();
    }

    ngOnDestroy() {
        this.boardService.stopGame();
    }

    // call updatePitPositions when view is rendered
    ngAfterViewInit() {
        /*
           sometimes there is a bug that the start-page component is not deleted before this component is rendered
           (you can check this by adding "debugger;" in the updatePitPositions function)
           because of this the y coordinate of the pit positions will be way too high
           after a very short time the start-page component is deleted
           We have to detect that and periodically check if the y coordinate is too high until it is not anymore
           (after testing I found that the delay of setInterval is enough to await the deletion of the start-page
           so in theory we could just use setTimeout instead of setInterval, but I want to be sure)
         */
        this.intervalId = setInterval(() => {
            const position = this.southStorePosition();
            if(position.y < 500){
                this.updatePitPositions();
                clearInterval(this.intervalId);
            }
        });

    }

    // call updatePositions when view is resized
    @HostListener('window:resize')
    onResize() {
        this.updatePitPositions();
    }

    updatePitPositions(){
        this.southPitPositions.set(this.southPitElements.map(pit => pit.getCenterPosition()));
        // reverse the north pit positions because the pits are in the opposite order
        this.northPitPositions.set(this.northPitElements.map(pit => pit.getCenterPosition()).reverse());
        this.northStorePosition.set(this.northStoreElement.getCenterPosition());
        this.southStorePosition.set(this.southStoreElement.getCenterPosition());
        this.pitSize.set(this.southPitElements.first.getSize());
        this.rendered = true;
    }

    move(position: number, onSouthSide: boolean) {
        if(this.movePossible(position, onSouthSide)) {
            this.boardService.doLegalMove(position);
        }
    }

    movePossible(position: number, onSouthSide: boolean) {
        return this.boardService.moveLegal(position, onSouthSide);
    }

    getIndexArray(size: number) {
        return Array(size).fill(0).map((e, i) => i);
    }

}
