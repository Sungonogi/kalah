import {TestBed} from '@angular/core/testing';

import {AudioService} from "./audio.service";
import {BoardService} from './board.service';
import {ComMoveService} from "./com-move.service";

describe('BoardService', () => {
    let service: BoardService;
    let comMoveMock: ComMoveService;

    beforeEach(() => {

        comMoveMock = jasmine.createSpyObj('ComMoveService', ['getMove']);

        TestBed.configureTestingModule({
            providers: [
                {provide: ComMoveService, useValue: comMoveMock},
                {provide: AudioService, useValue: jasmine.createSpyObj('AudioService', ['startAudio'])}
            ]
        });
        service = TestBed.inject(BoardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
