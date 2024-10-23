import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";

export interface WarningDialogData {
    title: string;
    text: string;
}

@Component({
    selector: 'app-navi-warning-dialog',
    standalone: true,
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatDialogClose
    ],
    templateUrl: './warning-dialog.component.html',
    styleUrl: './warning-dialog.component.scss'
})
export class WarningDialogComponent {

    private data = inject<WarningDialogData>(MAT_DIALOG_DATA);
    protected title = this.data.title;
    protected text = this.data.text;

}
