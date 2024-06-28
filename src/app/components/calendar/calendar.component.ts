import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vacation } from '../../models/vacation.model';
import { VacationService } from '../../services/vacation.service';
import { VacationDialogComponent } from '../vacation-dialog/vacation-dialog.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  monthDates: Date[] = [];
  selectedDate!: Date;
  vacations: Vacation[] = [];

  constructor(private dialog: MatDialog, private vacationService: VacationService) {
    this.vacations = this.vacationService.getVacations();
    this.initializeMonthDates();
  }

  initializeMonthDates() {
    const currentYear = new Date().getFullYear();
    this.monthDates = this.months.map((_, index) => new Date(currentYear, index, 1));
  }

  onDateSelected(date: Date | null) {
    if (date) {
      this.selectedDate = date;
      this.openDialog();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(VacationDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { type, hours } = result;
        this.vacationService.addVacation(this.selectedDate, type, hours);
        this.vacations = this.vacationService.getVacations();
      }
    });
  }

  getVacationType(date: Date): string | undefined {
    const vacation = this.vacations.find(v => v.date.toDateString() === date.toDateString());
    return vacation?.type;
  }

  getVacationHours(date: Date): number | undefined {
    const vacation = this.vacations.find(v => v.date.toDateString() === date.toDateString());
    return vacation?.hours;
  }

  isSelected(date: Date): boolean {
    return this.vacationService.isSelected(date);
  }

  isVacation(date: Date): boolean {
    return this.getVacationType(date) === 'vacation';
  }

  isFreeHours(date: Date): boolean {
    return this.getVacationType(date) === 'hours';
  }
}
