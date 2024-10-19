import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StoneManagerComponent} from './stone-manager.component';

describe('StoneManagerComponent', () => {
    let component: StoneManagerComponent;
    let fixture: ComponentFixture<StoneManagerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StoneManagerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StoneManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
