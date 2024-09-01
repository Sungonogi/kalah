import { Routes } from '@angular/router';
import {StartPageComponent} from "./pages/start-page/start-page.component";
import {GamePageComponent} from "./pages/game-page/game-page.component";

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
        path: '**',
        redirectTo: '/start'
    }
];
