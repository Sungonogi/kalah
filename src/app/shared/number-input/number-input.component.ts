import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";

@Component({
    selector: 'app-number-input',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatInput, FormsModule, MatFormField, MatLabel, MatError, NgIf, ReactiveFormsModule, NgClass],
    templateUrl: './number-input.component.html',
    styleUrl: './number-input.component.scss'
})
export class NumberInputComponent implements OnInit {

    // named startValue to make this component easier to use, but is also the value that will be updated
    @Input({required: true}) startValue = 0;
    @Input({required: true}) label = '';
    @Input() min = -Number.MAX_VALUE;
    @Input() max = Number.MAX_VALUE;

    // to send out the new value
    @Output() emitNumber = new EventEmitter<number>();
    @Output() emitError = new EventEmitter<boolean>();

    // to calculate maxlength of input field
    protected readonly Math = Math;

    form!: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            number: [this.startValue, [
                Validators.required,
                Validators.pattern('^\-?[0-9]*$'),
                Validators.min(this.min),
                Validators.max(this.max),
                ]
            ]
        });

        this.form.valueChanges.subscribe(() => {
            this.emitNumber.emit(this.form.value['number']);
        });

        this.form.statusChanges.subscribe(() => {
            if (this.form.invalid) {
                this.emitError.emit(false);
            } else {
                this.emitError.emit(true);
            }
        });
    }

    increment() {
        const num = Number(this.form.value['number']);
        if (num < this.max) {
            this.form.patchValue({number: num + 1});
        }
    }

    decrement() {
        const num = this.form.value['number'];
        if (num > this.min) {
            this.form.patchValue({number: num - 1});
        }
    }

}
