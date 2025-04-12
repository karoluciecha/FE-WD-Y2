import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// Needed for editind existing habit details (passing id in route)
import { ActivatedRoute } from '@angular/router';
// Needed for generating unique ID
import { v4 as uuidv4 } from 'uuid';

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

  constructor(private route: ActivatedRoute, private storageService: StorageService, private toastController: ToastController, private router: Router) { }

  async ngOnInit() {
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
      const toast = await this.toastController.create({
        message: 'You must be logged in to perform this action',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }
  
    if (!this.habitName.trim() || !this.frequency.trim()) {
      const toast = await this.toastController.create({
        message: 'Please fill out both Habit Name and Frequency before saving',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const key = `habits_${username}`;
    let storedHabits: any[] = (await this.storageService.get(key)) || [];
  
    if (this.habitId) {
      // Editing existing habit — update it
      const index = storedHabits.findIndex(h => String(h.id) === String(this.habitId));
      if (index !== -1) {
        storedHabits[index] = {
          ...storedHabits[index],
          name: this.habitName,
          description: this.habitDescription,
          frequency: this.frequency,
          level: this.level,
          startDate: this.startDate,
          active: true
        };
      }
    } else {
      // Creating new habit — generate a unique ID
      const newHabit = {
        id: uuidv4(),
        name: this.habitName,
        description: this.habitDescription,
        frequency: this.frequency,
        level: this.level,
        startDate: this.startDate,
        active: true
      };
      storedHabits.push(newHabit);
    }
  
    await this.storageService.set(key, storedHabits);
  
    const toast = await this.toastController.create({
      message: 'Habit saved successfully',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  
    this.router.navigate(['/edit-habit-all']);
  }
  
  async deleteHabit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      const toast = await this.toastController.create({
        message: 'You must be logged in to perform this action',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }    
  
    const key = `habits_${username}`;
    let storedHabits: any[] = (await this.storageService.get(key)) || [];
  
    if (storedHabits.some(h => String(h.id) === String(this.habitId))) {
      // Delete existing habit by ID
      storedHabits = storedHabits.filter(habit => habit.id !== this.habitId);
      await this.storageService.set(key, storedHabits);
  
      const toast = await this.toastController.create({
        message: 'Habit deleted successfully',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    } else {
      // Just clear the form if habit wasn't saved yet
      const toast = await this.toastController.create({
        message: 'New habit discarded',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  
    // Navigate back
    this.router.navigate(['/edit-habit-all']);
  }
}