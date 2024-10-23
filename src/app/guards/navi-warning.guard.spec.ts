import {TestBed} from '@angular/core/testing';
import {CanDeactivateFn} from '@angular/router';

import {naviWarningGuard} from './navi-warning.guard';

describe('naviWarningGuard', () => {
    const executeGuard: CanDeactivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => naviWarningGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
