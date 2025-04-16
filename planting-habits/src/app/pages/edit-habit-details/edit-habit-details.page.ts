import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { HabitService } from 'src/app/services/habit.service';
import { IonicModule } from '@ionic/angular';
// Needed for editing existing habit details (passing id in route)
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonLabel, IonItem, IonSelect, IonSelectOption, IonRange, IonDatetime, IonTextarea, ToastController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-edit-habit-details',
  templateUrl: './edit-habit-details.page.html',
  styleUrls: ['./edit-habit-details.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonContent, IonIcon, IonButton, IonButtons, IonToolbar, IonTitle, IonHeader, CommonModule, IonSelect, IonSelectOption, FormsModule, IonRange, IonDatetime, IonicModule, IonTextarea]
})
export class EditHabitDetailsPage implements OnInit {
  // Form fields
  habitId: string = '';
  habitName: string = '';
  habitDescription: string = '';
  frequency: string = '';
  level: number = 1;
  startDate = new Date().toISOString();

  // Used to restrict calendar to valid date range
  minDate = new Date().toISOString();
  maxDate = this.getTenYearsFromTodayISO();

  // State variables
  isEditing: boolean = false;
  initialLevel: number = 1; // default level (minimum)

  // Predefined frequency options
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
    this.themeService.applyStoredTheme(); // Apply stored theme
    this.loadHabitIfEditing(); // Load existing habit if editing

  }

  // Helper: Generate max selectable date (10 years ahead)
  getTenYearsFromTodayISO(): string {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 10);
    future.setHours(23, 59, 59, 999);
    return future.toISOString();
  }

  // Load existing habit details if editing (based on route param)
  private async loadHabitIfEditing() {
    await this.storageService.ready();

    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      this.router.navigate(['/edit-habit-all']);
      return;
    }

    const habitId = this.route.snapshot.paramMap.get('id');
    if (!habitId) return;

    const key = `habits_${username}`;
    const storedHabits = await this.storageService.get(key);
    const habit = (storedHabits || []).find((h: any) => String(h.id) === String(habitId));
    this.isEditing = true;

    if (habit) {
      // Populate form with existing values
      this.habitId = habit.id;
      this.habitName = habit.name;
      this.habitDescription = habit.description;
      this.frequency = habit.frequency;
      this.level = habit.level;
      this.initialLevel = habit.level;
      this.startDate = habit.startDate;
    }
  }

  // Handle Save button click
  async saveHabit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      return;
    }
  
    // Form validation
    if (!this.habitName.trim() || !this.frequency.trim()) {
      await this.showToast('Please fill out both Habit Name and Frequency before saving', 'warning');
      return;
    }
  
    // Package habit data to send to service
    const habitData = {
      id: this.habitId,
      name: this.habitName,
      description: this.habitDescription,
      frequency: this.frequency,
      level: this.level,
      startDate: this.startDate
    };
    await this.habitService.saveHabit(username, habitData, this.habitId);
    await this.showToast('Habit saved successfully', 'success');
    this.router.navigate(['/edit-habit-all']);
  }

  // Handle Delete button click
  async deleteHabit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      return;
    }
  
    // If habitId exists, it’s an existing habit — delete it
    if (this.habitId) {
      const deleted = await this.habitService.deleteHabit(username, this.habitId);
      const message = deleted ? 'Habit deleted successfully' : 'Habit not found';
      await this.showToast(message, deleted ? 'danger' : 'warning');
    } else {
      // New habit — just cancel action
      await this.showToast('New habit discarded', 'danger');
    }
  
    this.router.navigate(['/edit-habit-all']);
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