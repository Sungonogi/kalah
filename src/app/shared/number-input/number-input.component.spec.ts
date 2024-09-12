import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NumberInputComponent} from './number-input.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('NumberInputComponent', () => {
    let component: NumberInputComponent;
    let fixture: ComponentFixture<NumberInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NumberInputComponent,
                NoopAnimationsModule
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NumberInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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
