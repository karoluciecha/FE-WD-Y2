import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private storageService: StorageService) {}

  async applyStoredTheme() {
    const isDark = await this.storageService.getThemePreference();
    this.setTheme(isDark ?? true); // Default to dark mode
  }

  setTheme(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  async toggleTheme(isDark: boolean) {
    this.setTheme(isDark);
    await this.storageService.setThemePreference(isDark);
  }
}
