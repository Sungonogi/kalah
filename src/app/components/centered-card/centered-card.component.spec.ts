import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from '@angular/router';

import {CenteredCardComponent} from "./centered-card.component";

describe("CenteredCardComponent", () => {
    let component: CenteredCardComponent;
    let fixture: ComponentFixture<CenteredCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CenteredCardComponent],
            providers: [{provide: ActivatedRoute, useValue: {}}]
        }).compileComponents();

        fixture = TestBed.createComponent(CenteredCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
