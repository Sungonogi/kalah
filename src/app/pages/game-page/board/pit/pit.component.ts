import {NgClass, NgStyle} from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-pit',
    standalone: true,
    imports: [
        NgClass,
        NgStyle
    ],
    templateUrl: './pit.component.html',
    styleUrl: './pit.component.scss'
})
export class PitComponent implements OnInit, AfterViewInit {
    @Input({required: true}) stones!: number;

    // only relevant for pits
    @Input() hoverEffect = false;

    // only relevant for stores
    @Input() store = false;
    @Input() south!: boolean;
    @Input() playerType!: string;

    outerAspectRatio = '1 / 1';
    innerAspectRatio = '1 / 1';

    storeClass = '';
    movedDirection = '';

    // to give the stone manager the correct size
    @ViewChild('innerPit') innerPit!: ElementRef;

    // dynamically adjust the font size of the paragraph elements
    @ViewChild('stoneCountD') stoneCountD!: ElementRef;
    @ViewChild('stoneCountP') stoneCountP!: ElementRef;
    @ViewChild('playerP') playerP!: ElementRef;

    ngOnInit() {
        if(this.store) {
            this.outerAspectRatio = '1 / 2';
            this.innerAspectRatio = '2 / 3';
            this.storeClass = this.south ? 'south-store-container' : 'north-store-container';
            this.movedDirection = this.south ? 'top' : 'bottom';
        }
    }

    ngAfterViewInit() {
        this.updateFontSize();
    }

    // public method that returns the center of the pit
    getCenterPosition(): {x: number, y: number} {
        const rect = this.getRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        return {x, y};
    }

    // width and height are the same (except for the store but that is not relevant here)
    getSize(): number {
        return this.getRect().width;
    }

    private getRect(): DOMRect {
        return this.innerPit.nativeElement.getBoundingClientRect();
    }

    @HostListener('window:resize')
    onResize() {
        this.updateFontSize();
    }

    updateFontSize(){
        const pitSize = this.getSize();
        const fontSize = Math.min(30, Math.floor(pitSize / 6));
        this.stoneCountP.nativeElement.style.fontSize = `${fontSize}px`;
        if(this.store) {
            this.playerP.nativeElement.style.fontSize = `${fontSize}px`;
        }

        const stoneCountSize = Math.floor(fontSize * 1.5);
        this.stoneCountD.nativeElement.style.width = `${stoneCountSize}px`;
        this.stoneCountD.nativeElement.style.height = `${stoneCountSize}px`;
    }

}
