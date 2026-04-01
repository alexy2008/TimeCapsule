import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
export const appConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideAnimations(),
    ],
};
