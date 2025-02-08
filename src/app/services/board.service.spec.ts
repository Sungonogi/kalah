import {TestBed} from '@angular/core/testing';

import {AudioService} from "./audio.service";
import {BoardService} from './board.service';
import {ComMoveService} from "./com-move.service";
import { StartParamsStore } from '../stores/start-params/start-params.store';
import { startParamsStoreMock } from '../mocks/mocks';

describe('BoardService', () => {
    let service: BoardService;
    let comMoveMock: ComMoveService;
    const audioServiceMock = jasmine.createSpyObj('AudioService', ['startAudio']);

    beforeEach(() => {

        comMoveMock = jasmine.createSpyObj('ComMoveService', ['getMove']);

        TestBed.configureTestingModule({
            providers: [
                {provide: ComMoveService, useValue: comMoveMock},
                {provide: AudioService, useValue: audioServiceMock},
                {provide: StartParamsStore, useValue: startParamsStoreMock}
            ]
        });
        service = TestBed.inject(BoardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
