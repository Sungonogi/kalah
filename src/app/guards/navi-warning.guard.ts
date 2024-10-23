import {CanDeactivateFn} from '@angular/router';

import {GamePageComponent} from "../pages/game-page/game-page.component";

export const naviWarningGuard: CanDeactivateFn<GamePageComponent> = (component: GamePageComponent) => {
    return component.showNaviWarningDialog();
};
