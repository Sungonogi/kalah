import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ActivatedRoute} from "@angular/router";

import {PlayerType} from "../../models/player-type.enum";
import {StartParamsStore} from "../../stores/start-params/start-params.store";
import {StartPageComponent} from './start-page.component';

describe('StartPageComponent', () => {
    let component: StartPageComponent;
    let fixture: ComponentFixture<StartPageComponent>;
    const startParamsStore = jasmine.createSpyObj('StartParamsStore', ['playerSouth', 'playerNorth', 'seeds', 'pits', 'setStartParams']);

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [StartPageComponent, NoopAnimationsModule],
            providers: [
                {provide: ActivatedRoute, useValue: {}},
                {provide: StartParamsStore, useValue: startParamsStore}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(StartPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should submit the start params', () => {
        const mockStartParams = {playerSouth: PlayerType.Local, playerNorth: PlayerType.Local, seeds: 4, pits: 6};
        component.startParams = mockStartParams;

        expect(startParamsStore.setStartParams).toHaveBeenCalledTimes(0);

        component.submitStartParams();
        expect(startParamsStore.setStartParams).toHaveBeenCalledWith(mockStartParams);
    });
});
