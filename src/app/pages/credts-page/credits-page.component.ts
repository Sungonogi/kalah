import {Component} from "@angular/core";

import {CenteredCardComponent} from "../../components/centered-card/centered-card.component";

@Component({
    selector: "app-credits-page",
    standalone: true,
    imports: [CenteredCardComponent],
    templateUrl: "./credits-page.component.html",
    styleUrl: "./credits-page.component.scss",
})
export class CreditsPageComponent {}
