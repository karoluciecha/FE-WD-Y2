import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { HabitService } from 'src/app/services/habit.service';

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.page.html',
  styleUrls: ['./hall-of-fame.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class HallOfFamePage implements OnInit {
  habits: any[] = [];

  constructor(
    private storageService: StorageService,
    private habitService: HabitService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.loadHabits();
  }

  async loadHabits() {
    const username = await this.storageService.getUsername();
    const key = `habits_${username}`;
    const storedHabits = await this.storageService.get(key) || [];
  
    // Filter to only include habits with logCount > 0
    this.habits = storedHabits.filter((habit: any) => habit.logCount > 0);
  }
  

  getEmblemImage(level: number): string {
    return `assets/emblems/level${level}.png`;
  }

  isCompleted(habit: any): boolean {
    return habit.logCount >= habit.goalCount;
  }

  async showHabitDetails(habit: any) {
    const logsRemaining = habit.goalCount - habit.logCount;
    const nextLevelThreshold = this.habitService.getNextLevelThreshold(habit.currentLevel);
    const logsToNextLevel = nextLevelThreshold - habit.logCount;
    const formattedStartDate = new Date(habit.startDate).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
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
}