import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HabitService } from 'src/app/services/habit.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonList, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-edit-habit-all',
  templateUrl: './edit-habit-all.page.html',
  styleUrls: ['./edit-habit-all.page.scss'],
  standalone: true,
  imports: [IonLabel, IonList, IonBackButton, IonButtons, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule, IonicModule] // IonInput, IonTextarea
})
export class EditHabitAllPage implements OnInit {
  // Stores the list of habits for the logged-in user
  habits: {
    id: string;
    name: string;
    description: string;
    active: boolean;
    logCount: number;
    level: number;
    currentLevel: number;
    startDate: string;
    frequency: string;
  }[] = [];
  
  constructor(private router: Router,
    private storageService: StorageService,
    private toastController: ToastController,
    private themeService: ThemeService,
    private habitService: HabitService) { }

  // Ensures theme is applied and habits loaded
  async ngOnInit() {
    this.themeService.applyStoredTheme();
    await this.loadHabits();
  }  

  // Ensures habit list is refreshed when user adds / modifies / deletes a habit
  ionViewWillEnter() {
    this.loadHabits();
  }
  
  // Loads user habits from storage and handles login checks
  async loadHabits() {
    await this.storageService.ready();
  
    const username = await this.storageService.getUsername();
    if (!username) {
      // Show toast and redirect to login if no user is found
      const toast = await this.toastController.create({
        message: 'You must be logged in to perform this action',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
  
      this.habits = [];
      return;
    }
  
    // Load and assign habits from storage
    const key = `habits_${username}`;
    const storedHabits = await this.storageService.get(key);
    this.habits = storedHabits || [];
  }

  // Navigates to the add habit page if user is logged in
  async onAddHabit() {
    const username = await this.storageService.getUsername();
  
    if (!username) {
      const toast = await this.toastController.create({
        message: 'You must be logged in to perform this action',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      this.router.navigate(['/']);
      return;
    }
  
    this.router.navigate(['/edit-habit-details']);
  }

  // Gets the next due date for a habit, formatted for display
  getNextDueDate(habit: any): string {
    const rawDate = this.habitService.getNextDueDate(habit);
    if (!rawDate) return '';
  
    const date = new Date(rawDate);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}