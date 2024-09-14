import {provideHttpClient} from "@angular/common/http";
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter} from '@angular/router';
import {provideEffects} from '@ngrx/effects';
import {provideStore} from '@ngrx/store';

import {routes} from './app.routes';
import {boardStateReducer} from "./stores/board-state/board-state.reducer";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        importProvidersFrom([BrowserAnimationsModule]),
        provideHttpClient(),
        provideStore({boardState: boardStateReducer}),
        provideEffects()
    ]
};
