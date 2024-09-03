import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-redirect-button',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './redirect-button.component.html',
    styleUrl: './redirect-button.component.scss'
})
export class RedirectButtonComponent {
    // will be overwritten
    @Input({required: true}) link: string = '';
    @Input({required: true}) text: string = '';
}
