import {TestBed} from '@angular/core/testing';

import {ComputerMoveService} from './computer-move.service';

describe('ComputerMoveService', () => {
    let service: ComputerMoveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ComputerMoveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
