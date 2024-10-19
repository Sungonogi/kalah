import {NgIf} from "@angular/common";
import {Component, HostListener} from '@angular/core';
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {Router, RouterLink} from "@angular/router";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        RouterLink,
        MatButton,
        MatIcon,
        MatFabButton,
        NgIf,
        MatMiniFabButton,
        MatTooltip
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    showHelp = false;
    extended = false;

    constructor(router: Router) {

        this.showHelp = router.url !== '/tutorial';
        router.events.subscribe(() => {
            this.showHelp = router.url !== '/tutorial';
        });

        this.onResize();
    }

    // turn off extended if the screen size is below 600 px
    // so react to resizing of the screen
    @HostListener('window:resize')
    onResize() {
        this.extended = document.body.clientWidth > 600;
    }

}
