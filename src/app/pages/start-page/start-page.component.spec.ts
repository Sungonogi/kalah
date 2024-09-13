import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

import {StartPageComponent} from './start-page.component';

describe('StartPageComponent', () => {
    let component: StartPageComponent;
    let fixture: ComponentFixture<StartPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StartPageComponent, NoopAnimationsModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StartPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
