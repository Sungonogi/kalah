import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from "@angular/router";

import {TutorialPageComponent} from './tutorial-page.component';

describe('TutorialPageComponent', () => {
    let component: TutorialPageComponent;
    let fixture: ComponentFixture<TutorialPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TutorialPageComponent],
            providers: [{provide: ActivatedRoute, useValue: {}}]
        }).compileComponents();

        fixture = TestBed.createComponent(TutorialPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
