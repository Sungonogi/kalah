import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {Router, RouterLink} from "@angular/router";
import {values} from "lodash";

import {PlayerType} from "../../models/player-type.enum";
import {StartParams} from "../../models/start-params.model";
import {NumberInputComponent} from "../../shared/number-input/number-input.component";
import {StartParamsStore} from "../../stores/start-params/start-params.store";

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
    playerTypes = values(PlayerType);

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
