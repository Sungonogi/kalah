import {TestBed} from '@angular/core/testing';

import {ComMoveService} from './com-move.service';

describe('ComMoveService', () => {
    let service: ComMoveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ComMoveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
