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
        this.previousBoard = this.board();
        this.pits = this.previousBoard.pits;
    }

    ngAfterViewInit(): void {
        this.resetBoard();
    }

    @HostListener("window:resize")
    onResize(): void {
        this.updateSizeAndOffset();
        this.renderStones();
    }

    constructor() {

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

            if(this.previousBoard.gameOver){
                this.resetBoard();
                this.renderStones();
            } else {
                this.handleBoardChange(currentBoard);
            }
            this.previousBoard = currentBoard;
        });
    }

    private resetBoard(): void {
        const stonesArray = this.stones.toArray();
        const stonesPerPit = this.totalStones / (2 * this.pits);

        let stoneIndex = 0;
        for (let i = 0; i < this.pits; i++) {
            this.northPitStones[i] = [];
            this.southPitStones[i] = [];

            for (let j = 0; j < stonesPerPit; j++) {
                this.northPitStones[i].push(stonesArray[stoneIndex++]);
                this.southPitStones[i].push(stonesArray[stoneIndex++]);
            }

            this.southStoreStones = [];
            this.northStoreStones = [];
        }
    }

    private handleBoardChange(currentBoard: BoardPosition): void {

        // collect the stones
        const removedStones: ElementRef[] = [];
        for (let i = 0; i < this.pits; i++) {
            this.removeStonesFromPit(currentBoard, removedStones, i, 'north');
            this.removeStonesFromPit(currentBoard, removedStones, i, 'south');
        }
        this.removeStonesFromStore(currentBoard, removedStones, 'north');
        this.removeStonesFromStore(currentBoard, removedStones, 'south');

        // move the stones
        for (let i = 0; i < this.pits; i++) {
            this.movePitStones(currentBoard, removedStones, i, 'north');
            this.movePitStones(currentBoard, removedStones, i, 'south');
        }

        this.moveStonesToStore(currentBoard, removedStones, 'north');
        this.moveStonesToStore(currentBoard, removedStones, 'south');
    }

    private removeStonesFromPit(currentBoard: BoardPosition, removedStones: ElementRef[], pitIndex: number, side: 'north' | 'south'): void {
        const previousPit = this.previousBoard![`${side}Pits`][pitIndex];
        const currentPit = currentBoard[`${side}Pits`][pitIndex];
        const diff = previousPit - currentPit;
        for (let j = 0; j < diff; j++) {
            removedStones.push(this[`${side}PitStones`][pitIndex].pop()!);
        }
    }

    private removeStonesFromStore(currentBoard: BoardPosition, removedStones: ElementRef[], side: 'north' | 'south'): void {
        const previousStore = this.previousBoard![`${side}Store`];
        const currentStore = currentBoard[`${side}Store`];
        const diff = previousStore - currentStore;
        for (let i = 0; i < diff; i++) {
            removedStones.push(this[`${side}StoreStones`].pop()!);
        }
    }

    private movePitStones(currentBoard: BoardPosition, removedStones: ElementRef[], pitIndex: number, side: 'north' | 'south'): void {
        const diff = currentBoard[`${side}Pits`][pitIndex] - this.previousBoard![`${side}Pits`][pitIndex];
        for (let i = 0; i < diff; i++) {
            const stone = removedStones.pop()!;
            this[`${side}PitStones`][pitIndex].push(stone);
            this.adjustStonePosition(stone, this[`${side}PitPositions`]()[pitIndex]);
        }
    }

    private moveStonesToStore(currentBoard: BoardPosition, removedStones: ElementRef[], side: 'north' | 'south'): void {
        const previousStore = this.previousBoard![`${side}Store`];
        const currentStore = currentBoard[`${side}Store`];

        if (currentStore > previousStore) {
            const diff = currentStore - previousStore;
            for (let i = 0; i < diff; i++) {
                const stone = removedStones.pop()!;
                this[`${side}StoreStones`].push(stone);
                this.adjustStonePosition(stone, this[`${side}StorePosition`](), true);
            }
        }
    }

    renderStones(): void {
        this.rendered = true;

        for (let i = 0; i < this.pits; i++) {
            this.renderPitStoneSet(i, 'north');
            this.renderPitStoneSet(i, 'south');
        }

        this.renderStoreStoneSet('north');
        this.renderStoreStoneSet('south');
    }


    private renderPitStoneSet(pitIndex: number, side: 'north' | 'south'): void {
        const position = this[`${side}PitPositions`]()[pitIndex];
        this[`${side}PitStones`][pitIndex].forEach(stone => this.adjustStonePosition(stone, position));
    }


    private renderStoreStoneSet(side: 'north' | 'south'): void {
        const position = this[`${side}StorePosition`]();
        this[`${side}StoreStones`].forEach(stone => this.adjustStonePosition(stone, position, true));
    }

    adjustStonePosition(stone: ElementRef, position: { x: number; y: number }, isStore = false): void {
        const x = position.x + (Math.random() * this.offset - this.offset / 2) - this.stoneSize / 2;
        const yOffset = isStore ? 1.5 * this.offset : this.offset;
        const y = position.y + (Math.random() * yOffset - yOffset / 2) - this.stoneSize / 2;

        stone.nativeElement.style.left = `${x}px`;
        stone.nativeElement.style.top = `${y}px`;
    }

    private updateSizeAndOffset(): void {
        const pitSize = this.pitSize();
        this.stoneSize = pitSize / 3;
        this.offset = pitSize - this.stoneSize - 5;
    }

    getIndexArray(stones: number): number[] {
        return Array.from({length: stones}, (_, i) => i);
    }
}
