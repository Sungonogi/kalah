import {Routes} from '@angular/router';

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
        component: GamePageComponent
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
