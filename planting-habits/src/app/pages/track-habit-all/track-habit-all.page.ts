import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonProgressBar,
  IonLabel, IonCheckbox, IonItem, IonList, ToastController, AlertController
} from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { HabitService } from 'src/app/services/habit.service';

@Component({
  selector: 'app-track-habit-all',
  templateUrl: './track-habit-all.page.html',
  styleUrls: ['./track-habit-all.page.scss'],
  standalone: true,
  imports: [
    IonList, IonItem, IonCheckbox, IonLabel, IonProgressBar,
    IonBackButton, IonButtons, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class TrackHabitAllPage implements OnInit {
  todayHabits: any[] = []; // List of habits due today
  completedCount = 0; // Number of habits completed today
  lastLoadedDate = ''; // Used to detect date changes for reloading habits

  constructor(
    private storageService: StorageService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private themeService: ThemeService,
    private habitService: HabitService
  ) {}

  async ngOnInit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      this.router.navigate(['/']);
      return;
    }

    this.themeService.applyStoredTheme();
    this.loadHabitsForToday();
  }

  ionViewWillEnter() {
    // Refresh habit list when confirmation dialog is closed
    this.loadHabitsForToday();
  }

  ionViewDidEnter() {
    // Reload if the date has changed while the app was in the background
    const today = this.habitService.formatDateToLocalYYYYMMDD(new Date());
    if (this.lastLoadedDate !== today) {
      this.loadHabitsForToday();
      this.lastLoadedDate = today;
    }
  }

  // Loads all habits for the current user and filters those due today
  async loadHabitsForToday() {
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

    const allHabits = await this.storageService.get(`habits_${username}`) || [];
    const today = new Date();
    const todayStr = this.habitService.formatDateToLocalYYYYMMDD(today);

    // Map all habits and add tracking metadata
    this.todayHabits = allHabits.map((habit: any) => {
      const isDue = this.habitService.isHabitDueToday(habit, today);
      const isLoggedToday = habit.lastLogged === todayStr;
      const currentLevel = this.habitService.getCurrentLevel(habit.logCount);
      const levelReached = habit.logCount >= habit.goalCount;

      return {
        ...habit,
        checkedToday: isLoggedToday,
        currentLevel,
        levelReached,
        isDue
      };
    }).filter((h: any) => h.isDue && (!h.levelReached || h.checkedToday));

    this.completedCount = this.todayHabits.filter(h => h.checkedToday).length;
  }

  // Handles checkbox log action, with confirmation alert
  async onHabitCheck(habit: any) {
    const alert = await this.alertController.create({
      header: 'Log Habit',
      message: `Do you want to log "${habit.name}" for today?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => this.loadHabitsForToday() // Revert checkbox if cancelled
        },
        {
          text: 'Log Now',
          handler: async () => {
            const username = await this.storageService.getUsername();
            if (!username) return;
            
            // Log habit for today
            await this.habitService.logHabitToday(habit, username);
            
            // Refresh list to update state and progress bar
            this.loadHabitsForToday();
          }
        }
      ]
    });

    await alert.present();
  }

  // Reusable toast message handler
  private async showToast(message: string, color: string = 'default') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  } 
}