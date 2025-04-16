import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { LEVEL_THRESHOLDS, FREQUENCY_INTERVALS } from '../constants/habit.constants';

@Injectable({ providedIn: 'root' })
export class HabitService {

  constructor(private storage: StorageService) {}

  // Calculates the current level of a habit based on log count using LEVEL_THRESHOLDS.
  getCurrentLevel(logCount: number): number {
    const index = LEVEL_THRESHOLDS.findIndex((t: any) => logCount < t);
    return Math.max(0, index - 1);
  }

  // Determines if a habit is due today based on start date and frequency.
  // Optionally, a different date can be passed in place of "today".
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

  // Returns scheduled habit dates, extended if user missed logs.
  // Used in Calendar View.
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

  // Returns only the planned / scheduled occurrences (ignores missed logs).
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
  
// Returns the next due date (if any) after today from adjusted list.
  getNextDueDate(habit: any): string | null {
    const dates = this.getAdjustedOccurrenceDates(habit);
    const today = new Date().toISOString().split('T')[0];
    return dates.find(d => d > today) || null;
  }

  // Checks whether habit has reached or surpassed goalCount.
  isCompleted(habit: any): boolean {
    return habit.logCount >= habit.goalCount;
  }

// Save or update habit entry in storage.
async saveHabit(username: string, habitData: any, habitId?: string): Promise<void> {
  const key = `habits_${username}`;
  const habits: any[] = await this.storage.get(key) || [];

  const goalMap = LEVEL_THRESHOLDS.slice(1);
  const goalCount = goalMap[habitData.level - 1];

  if (habitId) {
    // Update existing habit
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
    // Create new habit
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

// Remove a habit from storage.
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

// Helper: converts a Date object to local YYYY-MM-DD string.
public formatDateToLocalYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Handles logging a habit.
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

// Returns the number of logs required to reach the next level.
getNextLevelThreshold(currentLevel: number): number {
  return LEVEL_THRESHOLDS[currentLevel + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

}