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

}
