
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonProgressBar, IonLabel, IonCheckbox, IonItem, IonList } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-track-habit-all',
  templateUrl: './track-habit-all.page.html',
  styleUrls: ['./track-habit-all.page.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonCheckbox, IonLabel, IonProgressBar, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TrackHabitAllPage implements OnInit {
  todayHabits: any[] = [];
  completedCount = 0;
  lastLoadedDate: string = '';
  justCompleted: boolean = false;

  constructor(
    private storageService: StorageService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHabitsForToday();
  }

  ionViewWillEnter() {
    this.loadHabitsForToday();
  }

  ionViewDidEnter() {
    const today = new Date().toISOString().split('T')[0];
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
    const now = new Date();
    const todayStr = this.getLocalDateString(now);
  
    for (const habit of allHabits) {
      if (habit.justCompleted && habit.lastLogged !== todayStr) {
        habit.active = false;
        habit.justCompleted = false;
      }
    }
    await this.storageService.set(`habits_${username}`, allHabits);

    const goalThresholds = [0, 1, 5, 10, 25, 50, 69, 100, 250, 500, 1000];
  
    const computedHabits = allHabits.map((habit: any) => {
      // Use the stored lastLogged string (if any) directly for local comparison.
      const lastLoggedStr = habit.lastLogged || '';
      const isLoggedToday = lastLoggedStr === todayStr;
  
      // Recalculate currentLevel using the local logCount:
      let currentLevel = goalThresholds.findIndex(threshold => habit.logCount < threshold) - 1;
      if (currentLevel < 0) currentLevel = 0;
  
      // Consider the habit "completed" if its logCount is >= goalCount.
      const levelReached = habit.logCount >= habit.goalCount;
  
      return {
        ...habit,
        checkedToday: isLoggedToday,
        currentLevel,
        levelReached
      };
    });
  
    // Filter to show only active, due habits, and exclude those that are completed (unless they were logged today)
    this.todayHabits = computedHabits.filter((habit: any) =>
      this.isHabitDueToday(habit, now) &&
      (habit.active || habit.checkedToday)
  );
  
    this.completedCount = this.todayHabits.filter(h => h.checkedToday).length;
  }
  
  

  isHabitDueToday(habit: any, current: Date): boolean {
    const start = new Date(habit.startDate);
    const currentStr = this.getLocalDateString(current);
    const startStr = this.getLocalDateString(start);
    
    // Calculate difference in full local days:
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    switch (habit.frequency) {
      case 'Every day': 
        return diffDays >= 0;
      case 'Every other day': 
        return diffDays >= 0 && diffDays % 2 === 0;
      case 'Every week': 
        return diffDays >= 0 && diffDays % 7 === 0;
      case 'Every two weeks': 
        return diffDays >= 0 && diffDays % 14 === 0;
      case 'Every month': 
        // Compare local day-of-month
        return start.getDate() === current.getDate();
      case 'Every quarter': 
        return start.getDate() === current.getDate() && [0, 3, 6, 9].includes(current.getMonth() % 12);
      case 'Every 6 months': 
        return start.getDate() === current.getDate() && [0, 6].includes(current.getMonth() % 12);
      case 'Every year': 
        return start.getDate() === current.getDate() && start.getMonth() === current.getMonth();
      default: 
        return false;
    }
  }

  async onHabitCheck(habit: any) {
    const alert = await this.alertController.create({
      header: 'Log Habit',
      message: `Do you want to log "${habit.name}" for today?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Ensure checkbox returns to unchecked if canceled
            this.loadHabitsForToday(); // Recalculates `checkedToday` safely
          }
        },
        {
          text: 'Log Now',
          handler: async () => {
            habit.logCount = (habit.logCount || 0) + 1;
  
            // Update level based on thresholds
            const goalThresholds = [0, 1, 5, 10, 25, 50, 69, 100, 250, 500, 1000];
            habit.currentLevel = goalThresholds.findIndex(t => habit.logCount < t) - 1;
            if (habit.currentLevel < 0) habit.currentLevel = 0;
  
            // Mark inactive if goal reached
            if (habit.logCount >= habit.goalCount) {
              habit.justCompleted = true;
            }
  
            habit.lastLogged = new Date().toISOString().split('T')[0];
  
            // Save updated habit (without transient UI data)
            const username = await this.storageService.getUsername();
            const allHabits = await this.storageService.get(`habits_${username}`) || [];
            const index = allHabits.findIndex((h: any) => String(h.id) === String(habit.id));
  
            if (index !== -1) {
              const habitToSave = { ...habit };
              delete habitToSave.checkedToday; // ← ensure transient data isn't stored
              delete habitToSave.levelReached;
              allHabits[index] = habitToSave;
  
              await this.storageService.set(`habits_${username}`, allHabits);
            }
  
            // Refresh habit list to recalculate checkedToday
            await this.loadHabitsForToday();
          }
        }
      ]
    });
  
    await alert.present();
  }

  getLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
}
