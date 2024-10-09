import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

import {BoardComponent} from "./board/board.component";

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
