import { Routes } from "@angular/router";

import { naviWarningGuard } from "./guards/navi-warning.guard";
import { AboutPageComponent } from "./pages/about-page/about-page.component";
import { GamePageComponent } from "./pages/game-page/game-page.component";
import { StartPageComponent } from "./pages/start-page/start-page.component";
import { TutorialPageComponent } from "./pages/tutorial-page/tutorial-page.component";
import { CreditsPageComponent } from "./pages/credts-page/credits-page.component";

export const routes: Routes = [
  {
    path: "start",
    component: StartPageComponent,
  },
  {
    path: "play",
    component: GamePageComponent,
    canDeactivate: [naviWarningGuard],
  },
  {
    path: "tutorial",
    component: TutorialPageComponent,
  },
  {
    path: "about",
    component: AboutPageComponent,
  },
  {
    path: "license",
    component: CreditsPageComponent,
  },
  {
    path: "**",
    redirectTo: "start",
  },
];
