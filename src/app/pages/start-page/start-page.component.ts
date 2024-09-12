import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NumberInputComponent} from "../../shared/number-input/number-input.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        NumberInputComponent,
        MatButtonModule
    ],
    templateUrl: './start-page.component.html',
    styleUrl: './start-page.component.scss'
})
export class StartPageComponent {

    seeds = 4;
    pits = 6;

    seedsValid = true;
    pitsValid = true;

}
