import {Component} from '@angular/core';

import {BoardComponent} from "./board/board.component";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [
        BoardComponent,
        MatButton,
        RouterLink
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

}
