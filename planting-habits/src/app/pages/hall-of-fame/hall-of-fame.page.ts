import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { HabitService } from 'src/app/services/habit.service';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonCardContent, ToastController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.page.html',
  styleUrls: ['./hall-of-fame.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, CommonModule, RouterModule]
})
export class HallOfFamePage implements OnInit {
  habits: any[] = []; // // Array to store the user's non-zero logCount habits

  constructor(
    private storageService: StorageService,
    private habitService: HabitService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      this.router.navigate(['/']);
      return;
    }

    await this.loadHabits(); // Load habits from storage on initialization
  }

  // Fetch habits from storage, filtering only those that have been logged at least once
  async loadHabits() {
    const username = await this.storageService.getUsername();
    const key = `habits_${username}`;
    const storedHabits = await this.storageService.get(key) || [];
  
    // Filter to only include habits with logCount > 0
    this.habits = storedHabits.filter((habit: any) => habit.logCount > 0);
  }
  
  // Get the image path for the emblem
  getEmblemImage(level: number): string {
    return `assets/emblems/level${level}.png`;
  }

  // Determine if a habit has been completed (all required logs achieved)
  isCompleted(habit: any): boolean {
    return habit.logCount >= habit.goalCount;
  }

  // Show a popup with detailed information about the selected habit
  async showHabitDetails(habit: any) {
    const logsRemaining = habit.goalCount - habit.logCount;
    const nextLevelThreshold = this.habitService.getNextLevelThreshold(habit.currentLevel);
    const logsToNextLevel = nextLevelThreshold - habit.logCount;

    // Format the habit's start date for a readable display
    const formattedStartDate = new Date(habit.startDate).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Display alert with formatted habit details
    // innerHTMLTemplatesEnabled: true in main.ts is required for formatting to work
    const alert = await this.alertController.create({
      header: habit.name,
      subHeader: `Description: ${habit.description || 'No description'}`,
      message: `
        Start date: ${formattedStartDate}<br>
        Frequency: ${habit.frequency}<br><br>
        Level: ${habit.currentLevel} of ${habit.level}<br>
        Logs: ${habit.logCount} of ${habit.goalCount}<br><br>
        ${habit.currentLevel < habit.level 
          ? `Next level in: ${logsToNextLevel} ${logsToNextLevel === 1 ? 'log' : 'logs'}`
          : 'This habit is maxed out!'}
      `,
      buttons: ['Close']
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