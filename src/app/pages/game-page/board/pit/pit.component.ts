import {NgStyle} from "@angular/common";
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-pit',
    standalone: true,
    imports: [
        NgStyle
    ],
    templateUrl: './pit.component.html',
    styleUrl: './pit.component.scss'
})
export class PitComponent {
    // will be overwritten
    @Input({required: true}) stones = 0;
    @Input() aspectRatio = '1/1';

    /**
        @for which we use for the stones needs unique identifiers
        so I generate an array with numbers from 0 to stones - 1
     */

    getIndexArray(stones: number) {
        return Array(stones).fill(0).map((e,i)=>i);
    }


    getRandomPosition() {
        const offset = 80; // Controls the randomness range around the center
        const randomX = Math.random() * offset - offset / 2;  // Random offset between -offset/2 and offset/2
        const randomY = Math.random() * offset - offset / 2;

        return {
            top: `calc(50% + ${randomY}px)`,  // Position relative to the center
            left: `calc(50% + ${randomX}px)`, // Position relative to the center
            transform: 'translate(-50%, -50%)' // Ensure the center of the stone aligns with the random position
        };
    }

}
