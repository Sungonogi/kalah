import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {CUSTOM_ELEMENTS_SCHEMA, signal} from "@angular/core";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from "@angular/router";

import {GamePageComponent} from './game-page.component';
import {BoardService} from "../../services/board.service";
import {BoardComponent} from "./board/board.component";

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    const boardServiceMock = jasmine.createSpyObj(
        'BoardService',
        ['resetBoard', 'stopGame'],
        {boardPosition : signal(null), animatedBoardPosition: signal({gameOver: false})}
    );

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GamePageComponent, BoardComponent],
            providers: [
                {provide: ActivatedRoute, useValue: {}},
                provideHttpClient(),
                provideHttpClientTesting(),
                // we have to provide the BoardService mock for the BoardComponent which is part of this component
                {provide: BoardService, useValue: boardServiceMock}
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
