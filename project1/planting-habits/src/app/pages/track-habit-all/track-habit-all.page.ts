import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonProgressBar,
  IonLabel, IonCheckbox, IonItem, IonList
} from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController, AlertController } from '@ionic/angular';
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
  todayHabits: any[] = [];
  completedCount = 0;
  lastLoadedDate = '';

  constructor(
    private storageService: StorageService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private themeService: ThemeService,
    private habitService: HabitService
  ) {}

  ngOnInit() {
    this.themeService.applyStoredTheme();
    this.loadHabitsForToday();
  }

  ionViewWillEnter() {
    this.loadHabitsForToday();
  }

  ionViewDidEnter() {
    const today = this.habitService.formatDateToLocalYYYYMMDD(new Date());
    if (this.lastLoadedDate !== today) {
      this.loadHabitsForToday();
      this.lastLoadedDate = today;
    }
  }

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
    }).filter((h: any) => h.active && h.isDue && (!h.levelReached || h.checkedToday));

    this.completedCount = this.todayHabits.filter(h => h.checkedToday).length;
  }

  async onHabitCheck(habit: any) {
    const alert = await this.alertController.create({
      header: 'Log Habit',
      message: `Do you want to log "${habit.name}" for today?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => this.loadHabitsForToday()
        },
        {
          text: 'Log Now',
          handler: async () => {
            const username = await this.storageService.getUsername();
            if (!username) return;
            await this.habitService.logHabitToday(habit, username);
            this.loadHabitsForToday();
          }
        }
      ]
    });

    await alert.present();
  }
}