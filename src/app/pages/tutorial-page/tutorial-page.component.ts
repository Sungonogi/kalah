import {Component} from '@angular/core';

import {CenteredCardComponent} from "../../components/centered-card/centered-card.component";


@Component({
    selector: 'app-tutorial-page',
    standalone: true,
    imports: [
        CenteredCardComponent
    ],
    templateUrl: './tutorial-page.component.html',
    styleUrl: './tutorial-page.component.scss'
})
export class TutorialPageComponent {

}
