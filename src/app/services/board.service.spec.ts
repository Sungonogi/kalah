import {TestBed} from '@angular/core/testing';

import {BoardService} from './board.service';
import {ComMoveService} from "./com-move.service";

describe('BoardService', () => {
    let service: BoardService;
    let comMoveMock: ComMoveService;

    beforeEach(() => {

        comMoveMock = jasmine.createSpyObj('ComMoveService', ['getMove']);

        TestBed.configureTestingModule({
            providers: [
                {provide: ComMoveService, useValue: comMoveMock}
            ]
        });
        service = TestBed.inject(BoardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
