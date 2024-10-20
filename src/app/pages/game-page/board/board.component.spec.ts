import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {signal} from "@angular/core";
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardService} from "../../../services/board.service";
import {BoardComponent} from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    const boardServiceMock = jasmine.createSpyObj(
        'BoardService',
        ['resetBoard', 'stopGame'],
        {boardPosition : signal(null), animatedBoardPosition: signal({gameOver: false})}
    );
    
    beforeEach(async () => {

        boardServiceMock.boardPosition = signal(null);
        boardServiceMock.animatedBoardPosition = signal(null);

        await TestBed.configureTestingModule({
            imports: [BoardComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: BoardService, useValue: boardServiceMock}
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
