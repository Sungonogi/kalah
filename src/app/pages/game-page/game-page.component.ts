import {Component, inject} from '@angular/core';
import {BoardComponent} from "./board/board.component";
import {StartParamsStore} from "../../stores/start-params/start-params.store";

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [
        BoardComponent
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

}
