
import { provideAnimations } from '@angular/platform-browser/animations';
/*import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent)
  .catch((err) => console.error(err)); */

  
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; // Adjust the path based on your project structure


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  