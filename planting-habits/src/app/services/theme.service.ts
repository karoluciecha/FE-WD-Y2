import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private storageService: StorageService) {}

  // Applies the stored theme preference when the app starts.
  // Defaults to dark mode if no preference is found.
  async applyStoredTheme() {
    const isDark = await this.storageService.getThemePreference();
    this.setTheme(isDark ?? true);
  }

  // Sets the theme on the page.
  // This toggles both Ionic's built-in dark class and a custom class.
  setTheme(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  // Toggles the theme based on user action and saves the preference.
  async toggleTheme(isDark: boolean) {
    this.setTheme(isDark);
    await this.storageService.setThemePreference(isDark);
  }
}
