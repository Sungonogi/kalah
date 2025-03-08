import {NgIf} from "@angular/common";
import {Component, HostListener} from '@angular/core';
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        MatButton,
        MatIcon,
        NgIf,
        MatMiniFabButton,
        MatTooltip,
        MatMenuModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    extended = false;

    constructor() {
        this.onResize();
    }

    // turn off extended if the screen size is below 600 px
    // so react to resizing of the screen
    @HostListener('window:resize')
    onResize() {
        this.extended = document.body.clientWidth > 600;
    }

}
