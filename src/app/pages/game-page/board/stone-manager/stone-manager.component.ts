import {NgStyle} from "@angular/common";
import {AfterViewInit, Component, effect, ElementRef, Input, QueryList, Signal, ViewChildren} from '@angular/core';

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
export class StoneManagerComponent implements AfterViewInit {

    protected readonly stoneSize = 60;
    protected readonly offset = 80;

    @Input({required: true}) totalStones!: number;
    @Input({required: true}) board!: Signal<BoardPosition>;
    @Input({required: true}) pitPositions!: {x:number, y: number}[];

    @ViewChildren('stoneElement') stones!: QueryList<ElementRef>;

    pits!: number;
    
    northStoreStones: ElementRef[] = [];
    southStoreStones: ElementRef[] = [];

    // initialize with pits empty arrays
    northPitStones: ElementRef[][] = [];
    southPitStones: ElementRef[][] = [];

    ngAfterViewInit() {
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

        this.northStoreStones.push(stones[stoneCount++]);
        this.southStoreStones.push(stones[stoneCount++]);

        console.log("rendering");

        this.renderStones();
    }

    constructor() {
        effect(() => {
            // move the stones to the new positions when the boardState changes
            const board = this.board();

            // empty the arrays
            this.northStoreStones = [];
            this.southStoreStones = [];
            this.northPitStones = this.northPitStones.map(() => []);
            this.southPitStones = this.southPitStones.map(() => []);

            // fill the arrays with the stones
            let stoneCount = 0;
            const stones = this.stones.toArray();
            for(let i = 0; i < board.pits; i++) {
                for(let j = 0; j < board.northPits[i]; j++) {
                    this.northPitStones[i].push(stones[stoneCount++]);
                }
                for(let j = 0; j < board.southPits[i]; j++) {
                    this.southPitStones[i].push(stones[stoneCount++]);
                }
            }

            for(let i = 0; i < board.northStore; i++) {
                this.northStoreStones.push(stones[stoneCount++]);
            }
            for(let i = 0; i < board.southStore; i++) {
                this.southStoreStones.push(stones[stoneCount++]);
            }

            this.renderStones();

        });
    }

    renderStones() {
        // position the stones in the arrays accordingly
        for(let i = 0; i < this.pits; i++) {
            const northPit = this.northPitStones[i];
            const southPit = this.southPitStones[i];

            const northPosition = this.getNorthPitPosition(i);
            const southPosition = this.getSouthPitPosition(i);

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

        const northStorePosition = this.getNorthStorePosition();
        const southStorePosition = this.getSouthStorePosition();
        console.log(southStorePosition);

        northStore.forEach(stone => {
            this.adjustStonePosition(stone, northStorePosition);
        });

        southStore.forEach(stone => {
            this.adjustStonePosition(stone, southStorePosition);
        });
    }

    getNorthStorePosition() {
        return this.pitPositions[0];
    }

    getSouthStorePosition() {
        return this.pitPositions[this.pits + 1];
    }

    getNorthPitPosition(index: number) {
        return this.pitPositions[this.pits - index];
    }

    getSouthPitPosition(index: number) {
        return this.pitPositions[this.pits + 2 + index];
    }

    /**
     @for which we use for the stones needs unique identifiers
      so I generate an array with numbers from 0 to stones - 1
     */
    getIndexArray(stones: number) {
        return Array(stones).fill(0).map((e,i)=>i);
    }

    adjustPosition(initial : number){
        return initial + (Math.random() * this.offset - this.offset / 2) - 0.5 * this.stoneSize;
    }

    adjustStonePosition(stone: ElementRef, position: {x: number, y: number}) {
        const x = this.adjustPosition(position.x);
        const y = this.adjustPosition(position.y);

        stone.nativeElement.style.left = x + "px";
        stone.nativeElement.style.top = y + "px";
    }


}
