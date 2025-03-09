import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from '@angular/router';

import {AboutPageComponent} from "./about-page.component";

describe("AboutPageComponent", () => {
    let component: AboutPageComponent;
    let fixture: ComponentFixture<AboutPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AboutPageComponent],
            providers: [{provide: ActivatedRoute, useValue: {}}]
        }).compileComponents();

        fixture = TestBed.createComponent(AboutPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
