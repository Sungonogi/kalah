import {Component} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {RouterLink} from "@angular/router";

@Component({
    selector: "app-centered-card",
    standalone: true,
    imports: [
        MatCard,
        MatButton,
        RouterLink,
    ],
    templateUrl: "./centered-card.component.html",
    styleUrl: "./centered-card.component.scss",
})
export class CenteredCardComponent {
}
