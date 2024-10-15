import {NgStyle} from "@angular/common";
import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    QueryList,
    Signal,
    ViewChildren
} from "@angular/core";
import {isEqual} from "lodash";

import {BoardPosition} from "../../../../models/board-position.model";

@Component({
    selector: "app-stone-manager",
    standalone: true,
    imports: [NgStyle],
    templateUrl: "./stone-manager.component.html",
    styleUrl: "./stone-manager.component.scss"
})
export class StoneManagerComponent implements OnInit, AfterViewInit {
    @ViewChildren("stoneElement") stones!: QueryList<ElementRef>;

    @Input({required: true}) totalStones!: number;
    @Input({required: true}) southPitPositions!: Signal<{ x: number; y: number }[]>;
    @Input({required: true}) northPitPositions!: Signal<{ x: number; y: number }[]>;
    @Input({required: true}) northStorePosition!: Signal<{ x: number; y: number }>;
    @Input({required: true}) southStorePosition!: Signal<{ x: number; y: number }>;
    @Input({required: true}) pitSize!: Signal<number>;
    @Input({required: true}) board!: Signal<BoardPosition>;

    protected stoneSize!: number;
    protected offset!: number;
    private previousBoard?: BoardPosition;

    pits!: number;
    rendered = false;
    northStoreStones: ElementRef[] = [];
    southStoreStones: ElementRef[] = [];
    northPitStones: ElementRef[][] = [];
    southPitStones: ElementRef[][] = [];

    ngOnInit(): void {
        this.updateSizeAndOffset();
    }

    ngAfterViewInit(): void {
        this.initializeStones();
    }

    @HostListener("window:resize")
    onResize(): void {
        this.updateSizeAndOffset();
        this.renderStones();
    }

    constructor() {
        this.initializeReactiveEffects();
    }

    private initializeReactiveEffects(): void {
        effect(() => {
            this.southPitPositions();
            this.northPitPositions();
            this.northStorePosition();
            this.southStorePosition();
            this.pitSize();
            this.renderStones();
        });

        effect(() => {
            if (!this.previousBoard || !this.rendered) return;

            const currentBoard = this.board();
            if (isEqual(this.previousBoard, currentBoard)) return;

            this.moveStonesOnBoardChange(currentBoard);
            this.previousBoard = currentBoard;
        });
    }

    private initializeStones(): void {
        this.updateSizeAndOffset();
        this.pits = this.board().pits;
        const stonesArray = this.stones.toArray();
        const stonesPerPit = this.totalStones / (2 * this.pits);

        this.populatePitStones(stonesArray, stonesPerPit);
        this.previousBoard = this.board();
    }

    private populatePitStones(stonesArray: ElementRef[], stonesPerPit: number): void {
        let stoneIndex = 0;
        for (let i = 0; i < this.pits; i++) {
            this.northPitStones[i] = [];
            this.southPitStones[i] = [];

            for (let j = 0; j < stonesPerPit; j++) {
                this.northPitStones[i].push(stonesArray[stoneIndex++]);
                this.southPitStones[i].push(stonesArray[stoneIndex++]);
            }
        }
    }

    private moveStonesOnBoardChange(currentBoard: BoardPosition): void {
        // track where they were removed
        let removedStones: {el: ElementRef, arr: ElementRef[]}[] = [];
        for (let i = 0; i < this.pits; i++) {
            if (currentBoard.northPits[i] < this.previousBoard!.northPits[i]) {
                const removed  = this.northPitStones[i].map((stone: ElementRef) => {
                    return {el: stone, arr: this.northPitStones[i]};
                });
                removedStones = removedStones.concat(removed);
            }
            if(currentBoard.southPits[i] < this.previousBoard!.southPits[i]){
                const removed = this.southPitStones[i].map((stone: ElementRef) => {
                    return {el: stone, arr: this.southPitStones[i]};
                });
                removedStones = removedStones.concat(removed);
            }
        }

        this.moveStonesToNewPositions(currentBoard, removedStones);
    }

    private moveStonesToNewPositions(board: BoardPosition, removedStones: {el: ElementRef, arr: ElementRef[]}[]): void {
        for (let i = 0; i < this.pits; i++) {
            this.movePitStones(board, removedStones, i);
        }

        this.moveStoreStones(board, removedStones);
    }

    private movePitStones(board: BoardPosition, removedStones: {el: ElementRef, arr: ElementRef[]}[], pitIndex: number): void {
        if (board.northPits[pitIndex] > this.previousBoard!.northPits[pitIndex]) {
            const stone = removedStones.pop()!;
            stone.arr.pop();
            this.northPitStones[pitIndex].push(stone.el);
            this.adjustStonePosition(stone.el, this.northPitPositions()[pitIndex]);
        }

        if (board.southPits[pitIndex] > this.previousBoard!.southPits[pitIndex]) {
            const stone = removedStones.pop()!;
            stone.arr.pop();
            this.southPitStones[pitIndex].push(stone.el);
            this.adjustStonePosition(stone.el, this.southPitPositions()[pitIndex]);
        }
    }

    private moveStoreStones(board: BoardPosition, removedStones: {el: ElementRef, arr: ElementRef[]}[]): void {
        if (board.northStore > this.previousBoard!.northStore) {
            const diff = board.northStore - this.previousBoard!.northStore;
            for(let i = 0; i < diff; i++){
                const stone = removedStones.pop()!;
                stone.arr.pop();
                this.northStoreStones.push(stone.el);
                this.adjustStonePosition(stone.el, this.northStorePosition(), true);
            }
        }

        if (board.southStore > this.previousBoard!.southStore) {
            const diff = board.southStore - this.previousBoard!.southStore;
            for(let i = 0; i < diff; i++) {
                const stone = removedStones.pop()!;
                stone.arr.pop();
                this.southStoreStones.push(stone.el);
                this.adjustStonePosition(stone.el, this.southStorePosition(), true);
            }
        }
    }

    renderStones(): void {
        this.rendered = true;
        this.renderPitStones();
        this.renderStoreStones();
    }

    private renderPitStones(): void {
        for (let i = 0; i < this.pits; i++) {
            const northPosition = this.northPitPositions()[i];
            const southPosition = this.southPitPositions()[i];

            this.northPitStones[i].forEach(stone => this.adjustStonePosition(stone, northPosition));
            this.southPitStones[i].forEach(stone => this.adjustStonePosition(stone, southPosition));
        }
    }

    private renderStoreStones(): void {
        const northStorePosition = this.northStorePosition();
        const southStorePosition = this.southStorePosition();

        this.northStoreStones.forEach(stone => this.adjustStonePosition(stone, northStorePosition, true));
        this.southStoreStones.forEach(stone => this.adjustStonePosition(stone, southStorePosition, true));
    }

    adjustStonePosition(stone: ElementRef, position: { x: number; y: number }, store = false): void {
        const x = position.x + (Math.random() * this.offset - this.offset / 2) - this.stoneSize / 2;
        const yOffset = store ? 1.5 * this.offset : this.offset;
        const y = position.y + (Math.random() * yOffset - yOffset / 2) - this.stoneSize / 2;

        stone.nativeElement.style.left = `${x}px`;
        stone.nativeElement.style.top = `${y}px`;
    }

    private updateSizeAndOffset(): void {
        const pitSize = this.pitSize();
        this.stoneSize = pitSize / 3;
        // allow it to get in 5px range of the pit border
        this.offset = pitSize - this.stoneSize - 5;
    }

    /**
     @for which we use for the stones needs unique identifiers
      so I generate an array with numbers from 0 to stones - 1
     */
    getIndexArray(stones: number): number[] {
        return Array.from({length: stones}, (_, i) => i);
    }

}
