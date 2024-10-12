import {NgStyle} from "@angular/common";
import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    HostListener,
    Input, OnInit,
    QueryList,
    Signal,
    ViewChildren
} from '@angular/core';
import {isEqual} from "lodash";

import {BoardPosition} from "../../../../models/board-position.model";

@Component({
    selector: 'app-stone-manager',
    standalone: true,
    imports: [
        NgStyle
    ],
    templateUrl: './stone-manager.component.html',
    styleUrl: './stone-manager.component.scss'
})
export class StoneManagerComponent implements OnInit, AfterViewInit {

    protected stoneSize!: number;
    protected offset!: number;

    @ViewChildren('stoneElement') stones!: QueryList<ElementRef>;

    @Input({required: true}) totalStones!: number;

    @Input({required: true}) southPitPositions!: Signal<{x:number, y: number}[]>;
    @Input({required: true}) northPitPositions!: Signal<{x:number, y: number}[]>;
    @Input({required: true}) northStorePosition!: Signal<{x:number, y: number}>;
    @Input({required: true}) southStorePosition!: Signal<{x: number, y: number}>;
    @Input({required: true}) pitSize!: Signal<number>;

    @Input({required: true}) board!: Signal<BoardPosition>;

    previousBoard: BoardPosition | undefined = undefined;

    pits!: number;

    rendered = false;
    
    northStoreStones: ElementRef[] = [];
    southStoreStones: ElementRef[] = [];

    // initialize with pits empty arrays
    northPitStones: ElementRef[][] = [];
    southPitStones: ElementRef[][] = [];

    ngOnInit() {
        this.updateSizeAndOffset();
    }

    ngAfterViewInit() {
        this.updateSizeAndOffset();
        this.pits = this.board().pits;
        const stones = this.stones.toArray();
        const startAmount = this.totalStones / (2 * this.pits);

        let stoneCount = 0;

        // fill the arrays with the stones
        for(let i = 0; i < this.pits; i++) {
            this.northPitStones.push([]);
            this.southPitStones.push([]);

            for(let j = 0; j < startAmount; j++) {
                this.northPitStones[i].push(stones[stoneCount++]);
                this.southPitStones[i].push(stones[stoneCount++]);
            }
        }

        this.previousBoard = this.board();
    }

    @HostListener('window:resize')
    onResize() {
        this.updateSizeAndOffset();
        this.renderStones();
    }

    constructor() {
        // effect to rerender when the pitPositions change
        effect(() => {
            this.southPitPositions();
            this.northPitPositions();
            this.northStorePosition();
            this.southStorePosition();
            this.pitSize();

            this.renderStones();
        });

        // effect to adjust positions of stones when moves are made
        effect(() => {

            if(this.previousBoard === undefined || !this.rendered){
                return;
            }

            // move the stones to the new positions when the boardState changes
            const board = this.board();

            // check for deep equality
            if(isEqual(this.previousBoard, board)){
                return;
            }

            // check where the stones were removed
            const checkSouth = this.previousBoard.southTurn;
            const before = checkSouth ? this.previousBoard.southPits : this.previousBoard.northPits;
            const after = checkSouth ? board.southPits : board.northPits;
            let removedStones: ElementRef[] = [];
            for(let i = 0; i < this.pits; i++){
                if(after[i] < before[i]){
                    removedStones = checkSouth ? this.southPitStones[i] : this.northPitStones[i];
                }
            }

            // move the stones to the new position
            for(let i = 0; i < this.pits; i++) {
                // check if stones were added
                if(board.northPits[i] > this.previousBoard.northPits[i]){
                    // we know that there are still stones left
                    const stone = removedStones.pop() as ElementRef;
                    this.northPitStones[i].push(stone);

                    const northPosition = this.northPitPositions()[i];
                    this.adjustStonePosition(stone, northPosition);
                }

                if(board.southPits[i] > this.previousBoard.southPits[i]){
                    // we know that there are still stones left
                    const stone = removedStones.pop() as ElementRef;
                    this.southPitStones[i].push(stone);

                    const southPosition = this.southPitPositions()[i];
                    this.adjustStonePosition(stone, southPosition);
                }
            }

            // check if stones were added to the stores
            if(board.northStore > this.previousBoard.northStore){
                const stone = removedStones.pop() as ElementRef;
                this.northStoreStones.push(stone);

                const northStorePosition = this.northStorePosition();
                this.adjustStonePosition(stone, northStorePosition, true);
            }

            if(board.southStore > this.previousBoard.southStore){
                const stone = removedStones.pop() as ElementRef;
                this.southStoreStones.push(stone);

                const southStorePosition = this.southStorePosition();
                this.adjustStonePosition(stone, southStorePosition, true);
            }

            this.previousBoard = board;
        });
    }

    renderStones() {

        this.rendered = true;

        // position the stones in the arrays accordingly
        for(let i = 0; i < this.pits; i++) {
            const northPit = this.northPitStones[i];
            const southPit = this.southPitStones[i];

            const northPosition = this.northPitPositions()[i];
            const southPosition = this.southPitPositions()[i];

            northPit.forEach(stone => {
                this.adjustStonePosition(stone, northPosition);
            });

            southPit.forEach(stone => {
                this.adjustStonePosition(stone, southPosition);
            });

        }

        // position the stones in the stores
        const northStore = this.northStoreStones;
        const southStore = this.southStoreStones;

        const northStorePosition = this.northStorePosition();
        const southStorePosition = this.southStorePosition();

        northStore.forEach(stone => {
            this.adjustStonePosition(stone, northStorePosition, true);
        });

        southStore.forEach(stone => {
            this.adjustStonePosition(stone, southStorePosition, true);
        });
    }

    /**
     @for which we use for the stones needs unique identifiers
      so I generate an array with numbers from 0 to stones - 1
     */
    getIndexArray(stones: number) {
        return Array(stones).fill(0).map((e,i)=>i);
    }

    adjustStonePosition(stone: ElementRef, position: {x: number, y: number}, store = false) {
        const x = position.x + (Math.random() * this.offset - this.offset / 2) - this.stoneSize / 2;

        const yOffset = store ? 2 * this.offset : this.offset;
        const y = position.y + (Math.random() * yOffset - yOffset / 2) - this.stoneSize / 2;

        stone.nativeElement.style.left = x + "px";
        stone.nativeElement.style.top = y + "px";
    }

    // dynamically scale the stoneSize and offset between the max and min values
    updateSizeAndOffset(){
        const pitSize = this.pitSize();
        this.stoneSize = pitSize / 3;
        // allow it to get in 5px range of the pit border
        this.offset = pitSize - this.stoneSize - 5;
    }


}
