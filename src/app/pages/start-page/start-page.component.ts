import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NumberInputComponent} from "../../shared/number-input/number-input.component";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {PlayerType} from "../../models/player-type.model";
import {values} from "lodash";

@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        NumberInputComponent,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule
    ],
    templateUrl: './start-page.component.html',
    styleUrl: './start-page.component.scss'
})
export class StartPageComponent {

    // values for the player inputs
    playerTypes = values(PlayerType)
    playerSouth = PlayerType.Local;
    playerNorth = PlayerType.EasyCPU;

    // values for the number inputs
    seeds = 4;
    pits = 6;
    seedsValid = true;
    pitsValid = true;

}
