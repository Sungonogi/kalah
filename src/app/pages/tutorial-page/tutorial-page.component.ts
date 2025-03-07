import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatOption} from "@angular/material/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatSelect} from "@angular/material/select";
import {RouterLink} from "@angular/router";

import {CenteredCardComponent} from "../../components/centered-card/centered-card.component";


@Component({
    selector: 'app-tutorial-page',
    standalone: true,
    imports: [
        MatCard,
        MatButton,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        RouterLink,
        CenteredCardComponent
    ],
    templateUrl: './tutorial-page.component.html',
    styleUrl: './tutorial-page.component.scss'
})
export class TutorialPageComponent {

}
