import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { HabitService } from 'src/app/services/habit.service';
// Needed for editind existing habit details (passing id in route)
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-habit-details',
  templateUrl: './edit-habit-details.page.html',
  styleUrls: ['./edit-habit-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class EditHabitDetailsPage implements OnInit {
  habitId: string = '';
  habitName: string = '';
  habitDescription: string = '';
  frequency: string = '';
  level: number = 1;
  startDate = new Date().toISOString();
  minDate = new Date().toISOString();
  maxDate = this.getTenYearsFromTodayISO();
  isEditing: boolean = false;
  initialLevel: number = 1; // default level (minimum)
  
  // Get date 10 years from now
  getTenYearsFromTodayISO(): string {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 10);
    future.setHours(23, 59, 59, 999);
    return future.toISOString();
  }

  frequencies = [
    'Every day',
    'Every other day',
    'Every week',
    'Every two weeks',
    'Every month',
    'Every quarter',
    'Every 6 months',
    'Every year'
  ];

  constructor(private route: ActivatedRoute,
    private storageService: StorageService,
    private toastController: ToastController,
    private router: Router,
    private themeService: ThemeService,
    private habitService: HabitService
  ) { }

  async ngOnInit() {
    this.themeService.applyStoredTheme();
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
      this.router.navigate(['/edit-habit-all']);
      return;
    }
  
    const habitId = this.route.snapshot.paramMap.get('id');
    if (habitId) {
      const key = `habits_${username}`;
      const storedHabits = await this.storageService.get(key);
      const habit = (storedHabits || []).find((h: any) => String(h.id) === String(habitId));
      this.isEditing = true;

      if (habit) {
        this.habitId = habit.id;
        this.habitName = habit.name;
        this.habitDescription = habit.description;
        this.frequency = habit.frequency;
        this.level = habit.level;
        this.initialLevel = habit.level;
        this.startDate = habit.startDate;
      }
    }
  }

  async saveHabit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      return;
    }
  
    if (!this.habitName.trim() || !this.frequency.trim()) {
      await this.showToast('Please fill out both Habit Name and Frequency before saving', 'warning');
      return;
    }
  
    const habitData = {
      id: this.habitId,
      name: this.habitName,
      description: this.habitDescription,
      frequency: this.frequency,
      level: this.level,
      startDate: this.startDate
    };
  
    await this.habitService.saveHabit(username, habitData, this.habitId);
    await this.showToast('Habit saved successfully');
    this.router.navigate(['/edit-habit-all']);
  }

  async deleteHabit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      return;
    }
  
    const deleted = await this.habitService.deleteHabit(username, this.habitId);
    const message = deleted ? 'Habit deleted successfully' : 'New habit discarded';
  
    await this.showToast(message);
    this.router.navigate(['/edit-habit-all']);
  }
  

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }  
}