import {NgStyle} from "@angular/common";
import {
    AfterViewInit,
    Component,
    effect, EventEmitter,
    HostListener,
    inject,
    OnDestroy,
    OnInit, Output,
    QueryList,
    Signal,
    signal,
    ViewChild,
    ViewChildren,
    WritableSignal
} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

import {BoardPosition} from "../../../models/board-position.model";
import {PlayerType} from "../../../models/player-type.enum";
import {BoardService} from "../../../services/board.service";
import {StartParamsStore} from "../../../stores/start-params/start-params.store";
import {PitComponent} from "./pit/pit.component";
import {StoneManagerComponent} from "./stone-manager/stone-manager.component";

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

    @Output() gameOver = new EventEmitter<BoardPosition>();

    constructor(private boardService: BoardService) {

        effect(() => {
            const board = this.animatedBoardSignal();
            if(board.gameOver){
                this.gameOver.emit(board);
            }
        });

    }


    ngOnInit() {
        this.resetBoard();

        this.boardSignal = this.boardService.boardPosition;
        this.animatedBoardSignal = this.boardService.animatedBoardPosition;
        this.playerSouth = this.startParamsStore.playerSouth();
        this.playerNorth = this.startParamsStore.playerNorth();
        this.totalStones = 2 * this.startParamsStore.seeds() * this.startParamsStore.pits();
    }

    public resetBoard(){
        this.boardService.resetBoard();
    }

    public getBoard(){
        return this.boardSignal();
    }

    ngOnDestroy() {
        this.boardService.stopGame();
    }

    // call updatePitPositions when view is rendered
    ngAfterViewInit() {
        /*
           sometimes there is a bug that the start-page component is not deleted before this component is rendered
           (you can check this by adding "debugger;" in this function)
           because of this the y coordinate of the pit positions will be way too high
           after a very short time the start-page component is deleted
           we can just use setTimeout and then it will be deleted
         */
        setTimeout(() => this.updatePitPositions());
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
