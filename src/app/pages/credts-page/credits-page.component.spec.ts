import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from '@angular/router';

import {CreditsPageComponent} from "./credits-page.component";

describe("CreditsPageComponent", () => {
    let component: CreditsPageComponent;
    let fixture: ComponentFixture<CreditsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditsPageComponent],
            providers: [{provide: ActivatedRoute, useValue: {}}]
        }).compileComponents();

        fixture = TestBed.createComponent(CreditsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
