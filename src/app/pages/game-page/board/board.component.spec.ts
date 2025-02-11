import {ComponentFixture, TestBed} from '@angular/core/testing';

import {boardServiceMock, startParamsStoreMock} from '../../../mocks/mocks';
import {BoardService} from "../../../services/board.service";
import {StartParamsStore} from '../../../stores/start-params/start-params.store';
import {BoardComponent} from './board.component';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;
    
    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [BoardComponent],
            providers: [
                {provide: BoardService, useValue: boardServiceMock},
                {provide: StartParamsStore, useValue: startParamsStoreMock}
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
