import {provideHttpClient} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {BoardPosition} from "../models/board-position.model";
import {PlayerType} from "../models/player-type.enum";
import {ComMoveService} from './com-move.service';

describe('ComMoveService', () => {
    let service: ComMoveService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        httpTesting = TestBed.inject(HttpTestingController);

        service = TestBed.inject(ComMoveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should request a move and return an observable with it', fakeAsync(() => {
        const playerType = PlayerType.EasyCom;
        const boardPosition = {} as BoardPosition;
        const mockMove = 1;

        service.requestMove(boardPosition, playerType).subscribe((move) => {
            expect(move).toBe(mockMove);
        });

        const req = httpTesting.expectOne("http://localhost:9090/api/computerMove");
        req.flush({move: mockMove, comment: "test worked"});

        tick(2000);
    }));

    afterEach(() => {
        httpTesting.verify();
    });
});
