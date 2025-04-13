import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Critical import for the HttpClient APIs to work
import { provideHttpClient } from '@angular/common/http';

// Critical import for the Ionic Storage APIs to work
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// Import the necessary icons from Ionicons
import { addIcons } from 'ionicons';
import { addOutline, settingsOutline, saveOutline, trashOutline } from 'ionicons/icons';

// Register only the icons needed
addIcons({
  'add-outline': addOutline,
  'settings-outline': settingsOutline,
  'save-outline': saveOutline,
  'trash-outline': trashOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    // Add here to provide the HttpClient module
    provideHttpClient(),
    // Add here to provide the Ionic Storage module
    importProvidersFrom(IonicStorageModule.forRoot()), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
