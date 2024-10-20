import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

import {PlayerType} from "../../../../models/player-type.enum";
import {GameOverDialogComponent} from './game-over-dialog.component';

const mockDialogData = {
    board: {
        southStore: 24,
        northStore: 24
    },
    playerSouth: PlayerType.Local,
    playerNorth: PlayerType.Local
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

    it('should return draw message', () => {
        component['board'].southStore = 24;
        component['board'].northStore = 24;
        component['playerSouth'] = PlayerType.Local;
        component['playerNorth'] = PlayerType.Local;

        expect(component.gameOverMessage()).toBe('It is a draw');
    });

    it('should return local player win message', () => {

        component['board'].southStore = 25;
        component['board'].northStore = 23;
        component['playerSouth'] = PlayerType.Local;
        component['playerNorth'] = PlayerType.EasyCom;

        expect(component.gameOverMessage()).toBe('You won');
    });

    it('should return local player loss message', () => {

        component['board'].southStore = 23;
        component['board'].northStore = 25;
        component['playerSouth'] = PlayerType.Local;
        component['playerNorth'] = PlayerType.EasyCom;

        expect(component.gameOverMessage()).toBe('You lost');
    });

    it('should return north player win message', () => {

        component['board'].southStore = 11;
        component['board'].northStore = 37;
        component['playerSouth'] = PlayerType.EasyCom;
        component['playerNorth'] = PlayerType.Stickfish;

        expect(component.gameOverMessage()).toBe('North (Stickfish) won');
    });
});
