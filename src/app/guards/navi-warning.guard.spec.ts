import {TestBed} from '@angular/core/testing';
import {CanDeactivateFn} from '@angular/router';

import {GamePageComponent} from "../pages/game-page/game-page.component";
import {naviWarningGuard} from './navi-warning.guard';

describe('naviWarningGuard', () => {
    // @ts-expect-error - it does not matter as it just takes the component as parameter
    const executeGuard: CanDeactivateFn = (component: GamePageComponent) =>
        // @ts-expect-error - see above
        TestBed.runInInjectionContext(() => naviWarningGuard(component));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
