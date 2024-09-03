import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {RedirectButtonComponent} from "../../shared/redirect-button/redirect-button.component";

@Component({
    selector: 'app-start-page',
    standalone: true,
    imports: [
        RouterLink,
        RedirectButtonComponent,
    ],
    templateUrl: './start-page.component.html',
    styleUrl: './start-page.component.scss'
})
export class StartPageComponent {

}
