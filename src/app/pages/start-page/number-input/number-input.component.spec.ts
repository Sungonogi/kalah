import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

import {NumberInputComponent} from './number-input.component';

describe('NumberInputComponent', () => {
    let component: NumberInputComponent;
    let fixture: ComponentFixture<NumberInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NumberInputComponent,
                NoopAnimationsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NumberInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should increment the value', () => {
        component.startValue = 0;
        component.form.patchValue({number: 0});
        component.max = 10;

        component.increment();
        expect(component.form.value['number']).toBe(1);
    });

    it('should not increment the value if it is at the max', () => {
        component.startValue = 10;
        component.form.patchValue({number: 10});
        component.max = 10;

        component.increment();
        expect(component.form.value['number']).toBe(10);
    });

    it('should decrement the value', () => {
        component.startValue = 0;
        component.form.patchValue({number: 0});
        component.min = -10;

        component.decrement();
        expect(component.form.value['number']).toBe(-1);
    });

    it('should not decrement the value if it is at the min', () => {
        component.startValue = -10;
        component.form.patchValue({number: -10});
        component.min = -10;

        component.decrement();
        expect(component.form.value['number']).toBe(-10);
    });

    it('should correctly calculate the max digits', () => {
        component.max = 999;
        expect(component.calcMaxDigits()).toBe(3);

        component.max = 1000;
        expect(component.calcMaxDigits()).toBe(4);

        component.max = 12345;
        expect(component.calcMaxDigits()).toBe(5);
    });

});
