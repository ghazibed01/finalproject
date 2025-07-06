import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';


// Déclaration de window comme variable globale
(window as any).global = window;


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
