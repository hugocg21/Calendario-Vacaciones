import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { VacationDialogComponent } from '../vacation-dialog/vacation-dialog.component';
import { VacationService } from '../../services/vacation.service';

interface Day {
  date: moment.Moment;
  formatted: string;
  selected: boolean;
  type?: string; // 'vacation' or 'hours'
  hours?: number; // Add this line
  weekend: boolean;
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
  weekDays: string[] = moment.weekdaysShort(true);

  constructor(private dialog: MatDialog, private vacationService: VacationService) {}

  ngOnInit() {
    moment.updateLocale('en', {
      week: {
        dow: 1,
      }
    });

    this.generateCalendar();
    this.vacationService.getVacationDaysChangedEmitter().subscribe(() => {
      this.generateCalendar();
    });
  }

  generateCalendar() {
    const startOfYear = moment().startOf('year');
    this.months = [];
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
      const isSelected = this.vacationService.isSelected(dayDate.toDate());
      const vacation = this.vacationService.getVacations().find(v => new Date(v.date).toDateString() === dayDate.toDate().toDateString());
      const isWeekend = dayDate.day() === 0 || dayDate.day() === 6;

      days.push({
        date: dayDate,
        formatted: dayDate.format('D'),
        selected: isSelected,
        type: vacation ? vacation.type : undefined,
        hours: vacation ? vacation.hours : undefined, // Add this line
        weekend: isWeekend
      });
    }

    return days;
  }

  selectDay(day: Day) {
    const dialogRef = this.dialog.open(VacationDialogComponent, {
      width: '300px',
      data: { date: day.date.toDate(), type: day.type, hours: day.hours }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.vacationService.removeVacation(day.date.toDate());
          day.selected = false;
          day.type = undefined;
        } else {
          const formattedDate = day.date.format('YYYY-MM-DD');
          if (result.type === 'vacation') {
            this.selectedDays.add(formattedDate);
            day.selected = true;
            day.type = 'vacation';
            this.vacationService.addVacation(day.date.toDate(), 'vacation');
          } else if (result.type === 'hours') {
            console.log(`Horas seleccionadas: ${result.hours} en el día ${formattedDate}`);
            this.selectedDays.add(formattedDate);
            day.selected = true;
            day.type = 'hours';
            day.hours = result.hours; // Add this line
            this.vacationService.addVacation(day.date.toDate(), 'hours', result.hours);
          }
        }
      }
    });
  }

  isSelected(day: Day): boolean {
    return this.vacationService.isSelected(day.date.toDate());
  }

  isCurrentMonth(day: Day, month: moment.Moment): boolean {
    return day.date.isSame(month, 'month');
  }
}
