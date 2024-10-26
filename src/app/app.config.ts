import {provideHttpClient} from "@angular/common/http";
import {ApplicationConfig, ErrorHandler, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {MyErrorHandler} from "./handlers/my-error-handler";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        importProvidersFrom([BrowserAnimationsModule]),
        provideHttpClient(),
        {provide: ErrorHandler, useClass: MyErrorHandler}
    ]
};
