import {Component} from '@angular/core';

import {CenteredCardComponent} from "../../components/centered-card/centered-card.component";

@Component({
    selector: 'app-about-page',
    standalone: true,
    imports: [CenteredCardComponent],
    templateUrl: './about-page.component.html',
    styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {

}
