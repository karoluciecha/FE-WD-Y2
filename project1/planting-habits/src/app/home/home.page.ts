import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { QuoteService } from '../services/quote.service';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { ThemeService } from '../services/theme.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})

export class HomePage implements OnInit, OnDestroy {
  username = '';
  isLoggedIn = false;
  quote: string = 'Loading motivational quote...';
  showSettings = false;
  inputName = '';
  isDarkMode = true;
  paletteToggle = false;


  private quoteInterval: any;

  constructor(
    private quoteService: QuoteService,
    private toast: ToastController,
    private renderer: Renderer2,
    private storageService: StorageService,
    private themeService: ThemeService,
  ) {}

  async ngOnInit() {
    this.themeService.applyStoredTheme();
    await this.storageService.ready();
  
    this.username = await this.storageService.getUsername();
    this.isLoggedIn = await this.storageService.isLoggedIn();
    this.isDarkMode = await this.storageService.getThemePreference();
    
    this.loadQuote();
    this.quoteInterval = setInterval(() => this.loadQuote(), 30000);
  }

  ngOnDestroy() {
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
  
        // Remove HTML tags from content
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
      this.username = this.inputName.trim();
      this.isLoggedIn = true;
      this.inputName = '';
  
      // Save to storage
      await this.storageService.setUsername(this.username);
      await this.storageService.setLoggedIn(true);
    }
  }

  async logout() {
    this.isLoggedIn = false;
    this.username = '';
  
    await this.storageService.removeUsername();
    await this.storageService.setLoggedIn(false);
  }

  async toggleTheme(event: CustomEvent<{ checked: boolean }>) {
    const isDark = event.detail.checked;
    this.isDarkMode = isDark;
    this.paletteToggle = isDark;
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