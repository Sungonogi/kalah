import {NgStyle} from "@angular/common";
import {Component, ElementRef, Input} from '@angular/core';

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
    @Input({required: true}) stones!: number;
    @Input() aspectRatio = '1/1';

    constructor(public elementRef: ElementRef) { }

    // public method that returns the center of the pit
    getCenterPosition(): {x: number, y: number} {
        const rect = this.elementRef.nativeElement.querySelector('.pit').getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        return {x, y};
    }

}
