import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

import {GameOverDialogComponent} from './game-over-dialog.component';

const mockDialogData = {
    board: {
        southStore: 0,
        northStore: 0
    },
    playerSouth: 'Local',
    playerNorth: 'Local'
};


describe('GameOverDialogComponent', () => {
    let component: GameOverDialogComponent;
    let fixture: ComponentFixture<GameOverDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameOverDialogComponent],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: mockDialogData}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(GameOverDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
