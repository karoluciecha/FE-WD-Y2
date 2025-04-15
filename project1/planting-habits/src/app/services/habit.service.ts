import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { LEVEL_THRESHOLDS, FREQUENCY_INTERVALS } from '../constants/habit.constants';

@Injectable({ providedIn: 'root' })
export class HabitService {

  constructor(private storage: StorageService) {}

  // Calculates the current level of a habit.
  getCurrentLevel(logCount: number): number {
    const index = LEVEL_THRESHOLDS.findIndex(t => logCount < t);
    return Math.max(0, index - 1);
  }

  // This function checks if a habit is due today (or any other day that is passed to it) based on its frequency and start date.
  isHabitDueToday(habit: any, today = new Date()): boolean {
    const start = new Date(habit.startDate);
    const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return false;

    switch (habit.frequency) {
      case 'Every day': return true;
      case 'Every other day': return diffDays % 2 === 0;
      case 'Every week': return diffDays % 7 === 0;
      case 'Every two weeks': return diffDays % 14 === 0;
      case 'Every month': return start.getDate() === today.getDate();
      case 'Every quarter': return start.getDate() === today.getDate() && (today.getMonth() - start.getMonth()) % 3 === 0;
      case 'Every 6 months': return start.getDate() === today.getDate() && (today.getMonth() - start.getMonth()) % 6 === 0;
      case 'Every year': return start.getDate() === today.getDate() && start.getMonth() === today.getMonth();
      default: return false;
    }
  }

  // Callendr view function to get the dates of habit occurrences based on its frequency and start date.
  getAdjustedOccurrenceDates(habit: any): string[] {
    const interval = FREQUENCY_INTERVALS[habit.frequency];
    if (!interval) return [];
  
    const start = new Date(habit.startDate);
    const missedLogs = Math.max(0, habit.goalCount - (habit.logCount || 0));
    const totalOccurrences = habit.goalCount + missedLogs;
  
    return Array.from({ length: totalOccurrences }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i * interval);
      return date.toISOString().split('T')[0];
    });
  }

  // Returns the occurrence dates for a habit based on its frequency and start date.
  getScheduledOccurrenceDates(habit: any): string[] {
    const interval = FREQUENCY_INTERVALS[habit.frequency];
    if (!interval) return [];
  
    const start = new Date(habit.startDate);
    return Array.from({ length: habit.goalCount }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i * interval);
      return date.toISOString().split('T')[0];
    });
  }  
  
// Returns the next due date after today for a habit based on its frequency and start date.
  getNextDueDate(habit: any): string | null {
    const dates = this.getAdjustedOccurrenceDates(habit);
    const today = new Date().toISOString().split('T')[0];
    return dates.find(d => d > today) || null;
  }

  // Checks if a habit is completed based on its log count and goal count.
  isCompleted(habit: any): boolean {
    return habit.logCount >= habit.goalCount;
  }

// Function to save / update a habit in the storage.
async saveHabit(username: string, habitData: any, habitId?: string): Promise<void> {
  const key = `habits_${username}`;
  const habits: any[] = await this.storage.get(key) || [];

  const goalMap = [1, 5, 10, 25, 50, 69, 100, 250, 500, 1000];
  const goalCount = goalMap[habitData.level - 1];

  if (habitId) {
    const index = habits.findIndex(h => String(h.id) === String(habitId));
    if (index !== -1) {
      habits[index] = {
        ...habits[index],
        ...habitData,
        goalCount,
        active: true
      };
    }
  } else {
    const newHabit = {
      id: habitData.id || crypto.randomUUID(),
      name: habitData.name,
      description: habitData.description,
      frequency: habitData.frequency,
      level: habitData.level,
      goalCount,
      startDate: habitData.startDate,
      logCount: 0,
      currentLevel: 0,
      lastLogged: null,
      active: true
    };
    habits.push(newHabit);
  }

  await this.storage.set(key, habits);
}

// Function to delete a habit from the storage.
async deleteHabit(username: string, habitId: string): Promise<boolean> {
  const key = `habits_${username}`;
  let storedHabits: any[] = await this.storage.get(key) || [];
  const exists = storedHabits.some(h => String(h.id) === String(habitId));

  if (exists) {
    storedHabits = storedHabits.filter(h => h.id !== habitId);
    await this.storage.set(key, storedHabits);
    return true;
  }

  return false;
}

// Helper function to format date from UTC to local
public formatDateToLocalYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Log a habit for today and update its properties.
async logHabitToday(habit: any, username: string): Promise<void> {
  habit.logCount = (habit.logCount || 0) + 1;
  habit.currentLevel = this.getCurrentLevel(habit.logCount);
  habit.lastLogged = this.formatDateToLocalYYYYMMDD(new Date());

  if (habit.logCount >= habit.goalCount) {
    habit.active = false;
  }

  const key = `habits_${username}`;
  const allHabits: any[] = await this.storage.get(key) || [];
  const index = allHabits.findIndex((h: any) => String(h.id) === String(habit.id));
  if (index !== -1) {
    allHabits[index] = { ...habit };
    await this.storage.set(key, allHabits);
  }
}

// Function to get the next level threshold for a habit.
getNextLevelThreshold(currentLevel: number): number {
  return LEVEL_THRESHOLDS[currentLevel + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

}