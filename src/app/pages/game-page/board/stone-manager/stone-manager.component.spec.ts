import {signal} from "@angular/core";
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardPosition} from "../../../../models/board-position.model";
import {StoneManagerComponent} from './stone-manager.component';

describe('StoneManagerComponent', () => {
    let component: StoneManagerComponent;
    let fixture: ComponentFixture<StoneManagerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StoneManagerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(StoneManagerComponent);
        component = fixture.componentInstance;

        component.pitSize = signal(1);
        component.board = signal({pits: 1} as BoardPosition);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
