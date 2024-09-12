import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NumberInputComponent} from "../../shared/number-input/number-input.component";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {PlayerType} from "../../models/player-type.enum";
import {values} from "lodash";
import {MatCard} from "@angular/material/card";
import {StartParamsStore} from "../../stores/start-params/start-params.store";
import {StartParams} from "../../models/start-params.model";

@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        NumberInputComponent,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCard
    ],
    templateUrl: './start-page.component.html',
    styleUrl: './start-page.component.scss'
})
export class StartPageComponent implements OnInit{

    // stores the actual values
    startParams!: StartParams;

    // possible values for the player inputs
    playerTypes = values(PlayerType)

    // validation flags
    seedsValid = true;
    pitsValid = true;

    // inject the start params store
    startParamsStore = inject(StartParamsStore);

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.startParams = this.startParamsStore.startParams();
    }

    submitStartParams(){
        this.startParamsStore.setStartParams(this.startParams);
        this.router.navigate(['/play']);
    }
}
