import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

import {HeaderComponent} from './header.component';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const mockRouter = {
        url: '/tutorial',
        events: new BehaviorSubject(null)
    };

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                {provide: ActivatedRoute, useValue: {}},
                {provide: Router, useValue: mockRouter}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have showHelp set to false', () => {

        // the order of execution is not guaranteed so maybe the second test already changed this value
        mockRouter.url = '/tutorial';
        console.error("1", component.showHelp, mockRouter.url);

        expect(component.showHelp).toBeFalsy();
    });


    it('should set showHelp to true when url changes', () => {
        console.error("2", component.showHelp, mockRouter.url);

        expect(component.showHelp).toBeFalsy();

        mockRouter.url = '/not-tutorial';
        mockRouter.events.next(null);
        fixture.detectChanges();

        expect(component.showHelp).toBeTruthy();
    });


});
