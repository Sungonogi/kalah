import {Component, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-number-input',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatInput, FormsModule, MatFormField, MatLabel, MatError, NgIf, ReactiveFormsModule],
    templateUrl: './number-input.component.html',
    styleUrl: './number-input.component.scss'
})
export class NumberInputComponent {

    // named startValue to make this component easier to use, but is also the value that will be updated
    @Input({required: true}) startValue = 0;
    @Input({required: true}) label = '';
    @Input() min = -Number.MAX_VALUE;
    @Input() max = Number.MAX_VALUE;

    // to calculate maxlength of input field
    protected readonly Math = Math;

    increment() {
        if (this.startValue < this.max) {
            this.startValue++;
        }
    }

    decrement() {
        if (this.startValue > this.min) {
            this.startValue--;
        }
    }

    numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

}
