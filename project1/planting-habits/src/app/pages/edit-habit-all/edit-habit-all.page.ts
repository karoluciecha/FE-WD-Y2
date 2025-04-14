import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HabitService } from 'src/app/services/habit.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, IonBackButton, IonList, IonLabel, IonText, IonCard } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

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
  
  constructor(private router: Router,
    private storageService: StorageService,
    private toastController: ToastController,
    private themeService: ThemeService,
    private habitService: HabitService) { }

  async ngOnInit() {
    this.themeService.applyStoredTheme();
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