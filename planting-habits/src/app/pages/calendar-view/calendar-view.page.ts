import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { StorageService } from 'src/app/services/storage.service';
import { HabitService } from 'src/app/services/habit.service';
import { RouterModule } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { Router } from '@angular/router';
import { IonContent, IonTitle, IonButtons, IonHeader, IonToolbar, IonList, IonItem, IonLabel, IonIcon, ToastController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.page.html',
  styleUrls: ['./calendar-view.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, IonList, IonToolbar, IonHeader, IonButtons, IonTitle, IonContent, CommonModule, RouterModule, FullCalendarModule]
})
export class CalendarViewPage implements OnInit {
  
  // FullCalendar configuration object
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [], // dynamically populated in ngOnInit
  };

  selectedDate = new Date().toISOString().split('T')[0]; // Default: today
  selectedHabits: any[] = []; // List of habits shown below the calendar

  constructor(private storageService: StorageService, private habitService: HabitService, private themeService: ThemeService, private toastController: ToastController, private router: Router) {}

  async ngOnInit() {
    const username = await this.storageService.getUsername();
    if (!username) {
      await this.showToast('You must be logged in to perform this action', 'danger');
      this.router.navigate(['/']);
      return;
    }

    // Apply saved theme
    await this.themeService.applyStoredTheme();

    const habits = await this.storageService.get(`habits_${username}`) || [];

    // Generate all habit events using the service
    const allEvents = habits.flatMap((habit: any) =>
      this.habitService.getScheduledOccurrenceDates(habit).map((date, index) => ({
        title: habit.name,
        date,
        extendedProps: {
          habit,
          occurrence: index + 1 // e.g. "15 of 100" for tracking progress
        }
      }))
    );

    // Initialize calendar with generated events and interaction handlers
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: allEvents,
      selectable: true,
      dateClick: (info) => {
        const clickedDate = info.dateStr;
        this.updateSelectedHabits(clickedDate, allEvents); // Handle date square click
      },
      eventClick: (info) => {
        const clickedDate = info.event.startStr;
        this.updateSelectedHabits(clickedDate, allEvents); // Handle event dot click
      }
    };
    
    // Preload today's habits on calendar render
    const today = new Date().toISOString().split('T')[0];
    this.updateSelectedHabits(today, allEvents);
  }
    
  // Filters and sets selectedHabits for a specific calendar date
  updateSelectedHabits(dateStr: string, events: any[]) {
    this.selectedDate = dateStr;
    this.selectedHabits = events
    .filter(e => e.date === dateStr)
    .map(e => ({
      ...e.extendedProps.habit,
      occurrence: e.extendedProps.occurrence,
      goalCount: e.extendedProps.habit.goalCount
    }));
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