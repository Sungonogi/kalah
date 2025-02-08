import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardService} from "../../../services/board.service";
import {BoardComponent} from './board.component';
import { StartParamsStore } from '../../../stores/start-params/start-params.store';
import { boardServiceMock, startParamsStoreMock } from '../../../mocks/mocks';

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
