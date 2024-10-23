import {Routes} from '@angular/router';

import {naviWarningGuard} from "./guards/navi-warning.guard";
import {GamePageComponent} from "./pages/game-page/game-page.component";
import {StartPageComponent} from "./pages/start-page/start-page.component";
import {TutorialPageComponent} from "./pages/tutorial-page/tutorial-page.component";

export const routes: Routes = [
    {
        path: 'start',
        component: StartPageComponent
    },
    {
        path: 'play',
        component: GamePageComponent,
        canDeactivate: [naviWarningGuard]
    },
    {
        path: 'tutorial',
        component: TutorialPageComponent
    },
    {
        path: '**',
        redirectTo: 'start'
    }
];
