import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../services/quote.service';
import { StorageService } from '../services/storage.service';
import { ThemeService } from '../services/theme.service';
import { Device } from '@capacitor/device';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonToggle, IonInput } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonInput, IonToggle, IonLabel, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, CommonModule, RouterModule, FormsModule]
})
export class HomePage implements OnInit, OnDestroy {
  username = '';
  isLoggedIn = false;
  quote: string = 'Loading motivational quote...';
  showSettings = false;
  inputName = '';
  isDarkMode = true;
  paletteToggle = false;
  platformInfo: string = '';

  private quoteInterval: any;

  constructor(
    private quoteService: QuoteService,
    private toast: ToastController,
    private renderer: Renderer2,
    private storageService: StorageService,
    private themeService: ThemeService,
  ) {}

  async ngOnInit() {
    // Apply user's previously selected theme
    this.themeService.applyStoredTheme();

    // Wait for storage to initialize
    await this.storageService.ready();

    // Restore user login state and theme preference from storage
    this.username = await this.storageService.getUsername();
    this.isLoggedIn = await this.storageService.isLoggedIn();
    this.isDarkMode = await this.storageService.getThemePreference();

    // Retrieve device / platform info using Capacitor
    const info = await Device.getInfo();
    this.platformInfo = `${info.platform} - ${info.model || info.operatingSystem || ''}`;

    // Load the first quote and set up auto-refresh every 30 seconds
    this.loadQuote();
    this.quoteInterval = setInterval(() => this.loadQuote(), 30000);
  }

  ngOnDestroy() {
    // Clean up the interval to prevent memory leaks
    if (this.quoteInterval) {
      clearInterval(this.quoteInterval);
      this.quoteInterval = null;
    }
  }

  loadQuote() {
    this.quoteService.getQuotes().subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.quote = 'No quotes available.';
          return;
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        const quotePost = data[randomIndex];

        // Strip any HTML tags from the quote content for clean display
        const tempDiv = this.renderer.createElement('div');
        tempDiv.innerHTML = quotePost.content.rendered;
        const cleanedContent = tempDiv.textContent || tempDiv.innerText || '';

        this.quote = `"${cleanedContent.trim()}" - ${quotePost.title.rendered}`;
      },
      error: () => {
        this.quote = 'Could not load quote. Try again later.';
      }
    });
  }

  async login() {
    if (this.inputName.trim()) {
      // Save login data locally
      this.username = this.inputName.trim();
      this.isLoggedIn = true;
      this.inputName = '';

      await this.storageService.setUsername(this.username);
      await this.storageService.setLoggedIn(true);
    }
  }

  async logout() {
    // Reset login state and clear data from storage
    this.isLoggedIn = false;
    this.username = '';

    await this.storageService.removeUsername();
    await this.storageService.setLoggedIn(false);
  }

  async toggleTheme(event: CustomEvent<{ checked: boolean }>) {
    const isDark = event.detail.checked;
    this.isDarkMode = isDark;
    this.paletteToggle = isDark;

    // Use ThemeService to persist theme preference and apply changes
    await this.themeService.toggleTheme(isDark);
  }

  async showToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}