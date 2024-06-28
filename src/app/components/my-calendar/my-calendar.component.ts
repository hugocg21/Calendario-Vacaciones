import { Component } from '@angular/core';
import moment from 'moment';

interface Day {
  date: moment.Moment;
  formatted: string;
  selected: boolean;
}

interface Month {
  date: moment.Moment;
  days: Day[];
}

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrl: './my-calendar.component.css'
})
export class MyCalendarComponent {
  months: Month[] = [];
  selectedDays: Set<string> = new Set<string>();
  weekDays: string[] = [];

  constructor() {}

  ngOnInit() {
    // Configurar el inicio de la semana en lunes
    moment.updateLocale('en', {
      week: {
        dow: 1, // El día de inicio de la semana (0 - domingo, 1 - lunes)
      }
    });

    this.generateCalendar();
    this.weekDays = moment.weekdaysShort(true); // Obtener los nombres de los días de la semana comenzando por lunes
  }

  generateCalendar() {
    const startOfYear = moment().startOf('year');
    for (let i = 0; i < 12; i++) {
      const monthDate = startOfYear.clone().add(i, 'months');
      this.months.push({
        date: monthDate,
        days: this.getDaysInMonth(monthDate)
      });
    }
  }

  getDaysInMonth(month: moment.Moment): Day[] {
    const startOfMonth = month.clone().startOf('month');
    const endOfMonth = month.clone().endOf('month');
    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const date = startDate.clone().subtract(1, 'day');
    const days: Day[] = [];

    while (date.isBefore(endDate, 'day')) {
      const dayDate = date.add(1, 'day').clone();
      days.push({
        date: dayDate,
        formatted: dayDate.format('D'),
        selected: this.selectedDays.has(dayDate.format('YYYY-MM-DD'))
      });
    }

    return days;
  }

  selectDay(day: Day) {
    const formattedDate = day.date.format('YYYY-MM-DD');
    if (this.selectedDays.has(formattedDate)) {
      this.selectedDays.delete(formattedDate);
    } else {
      this.selectedDays.add(formattedDate);
    }
    day.selected = !day.selected;
  }

  isSelected(day: Day): boolean {
    return this.selectedDays.has(day.date.format('YYYY-MM-DD'));
  }

  isCurrentMonth(day: Day, month: moment.Moment): boolean {
    return day.date.isSame(month, 'month');
  }
}
