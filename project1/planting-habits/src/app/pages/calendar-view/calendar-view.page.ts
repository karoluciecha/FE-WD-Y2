import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { HabitService } from 'src/app/services/habit.service';
import { RouterModule } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.page.html',
  styleUrls: ['./calendar-view.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FullCalendarModule]
})
export class CalendarViewPage implements OnInit {
  
  // FullCalendar config object
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [], // dynamically populated in ngOnInit
  };

  selectedDate = new Date().toISOString().split('T')[0]; // Default: today
  selectedHabits: any[] = []; // Habits scheduled for selected date

  constructor(private storageService: StorageService, private habitService: HabitService, private themeService: ThemeService) {}

  async ngOnInit() {
    // Apply saved theme (light or dark)
    await this.themeService.applyStoredTheme();

    const username = await this.storageService.getUsername();
    const habits = await this.storageService.get(`habits_${username}`) || [];

    // Generate all habit events using the service
    const allEvents = habits.flatMap((habit: any) =>
      this.habitService.getScheduledOccurrenceDates(habit).map((date, index) => ({
        title: habit.name,
        date,
        extendedProps: {
          habit,
          occurrence: index + 1 // For displaying the n-th expected log
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
    
  // Show today's habits by default on first load
  const today = new Date().toISOString().split('T')[0];
      this.updateSelectedHabits(today, allEvents);
  }
    
  // Update habit list below calendar when date is clicked
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
}