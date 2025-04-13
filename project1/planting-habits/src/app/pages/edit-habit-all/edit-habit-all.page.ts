import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonList, IonLabel, IonText, IonCard } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-habit-all',
  templateUrl: './edit-habit-all.page.html',
  styleUrls: ['./edit-habit-all.page.scss'],
  standalone: true,
  imports: [IonLabel, IonList, IonBackButton, IonButtons, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class EditHabitAllPage implements OnInit {
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
  
  constructor(private router: Router, private storageService: StorageService, private toastController: ToastController) { }

  async ngOnInit() {
    await this.loadHabits();
  }  

  ionViewWillEnter() {
    this.loadHabits();
  }
  
  async loadHabits() {
    await this.storageService.ready();
  
    const username = await this.storageService.getUsername();
    if (!username) {
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
  
    const key = `habits_${username}`;
    const storedHabits = await this.storageService.get(key);
    this.habits = storedHabits || [];
  }

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

  getNextDueDate(habit: any): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time
  
    const lastLogged = habit.lastLogged ? new Date(habit.lastLogged) : null;
    if (lastLogged) lastLogged.setHours(0, 0, 0, 0);
  
    const startDate = new Date(habit.startDate);
    startDate.setHours(0, 0, 0, 0);
  
    // If the habit hasn’t started yet
    if (today < startDate) return startDate.toDateString();
  
    const isLoggedToday = lastLogged && lastLogged.getTime() === today.getTime();
  
    let daysToAdd = 0;
    switch (habit.frequency) {
      case 'Every day': daysToAdd = 1; break;
      case 'Every other day': daysToAdd = 2; break;
      case 'Every week': daysToAdd = 7; break;
      case 'Every two weeks': daysToAdd = 14; break;
      case 'Every month': daysToAdd = 30; break;
      case 'Every quarter': daysToAdd = 91; break;
      case 'Every 6 months': daysToAdd = 182; break;
      case 'Every year': daysToAdd = 365; break;
      default: return 'Unknown';
    }
  
    if (isLoggedToday) {
      const nextDue = new Date(today);
      nextDue.setDate(today.getDate() + daysToAdd);
      return nextDue.toDateString();
    } else {
      return today.toDateString(); // Still due today
    }
  }
}