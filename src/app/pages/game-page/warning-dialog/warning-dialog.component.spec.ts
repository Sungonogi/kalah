import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

import {WarningDialogComponent} from './warning-dialog.component';

describe('WarningDialogComponent', () => {
    let component: WarningDialogComponent;
    let fixture: ComponentFixture<WarningDialogComponent>;
    const mockDialogData = {
        title: 'Warning',
        message: 'Are you sure you want to quit?'
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WarningDialogComponent],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: mockDialogData}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WarningDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
