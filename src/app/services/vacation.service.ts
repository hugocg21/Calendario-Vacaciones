import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Vacation } from '../models/vacation.model';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private vacations: Vacation[] = [];
  private selectedDates: Set<string> = new Set();
  private totalVacationDays: number = 22; // Total inicial de días de vacaciones
  private usedVacationDays: number = 0;
  private totalFreeHours: number = 88.5; // Total inicial de horas libres
  private usedFreeHours: number = 0;

  private vacationDaysChanged = new Subject<void>();

  constructor() { }

  addVacation(date: Date, type: string, hours?: number) {
    this.vacations.push({ date, type, hours });
    this.selectedDates.add(date.toDateString());
    console.log(`Added vacation: ${date.toDateString()} with type: ${type} and hours: ${hours}`);
    if (type === 'vacation') {
      this.usedVacationDays++;
    } else if (type === 'hours' && hours) {
      this.usedFreeHours += hours;
    }
    this.vacationDaysChanged.next();
  }

  getVacations(): Vacation[] {
    return this.vacations;
  }

  isSelected(date: Date): boolean {
    const selected = this.selectedDates.has(date.toDateString());
    console.log(`Checking if selected: ${date.toDateString()} - ${selected}`);
    return selected;
  }

  toggleDateSelection(date: Date) {
    const dateString = date.toDateString();
    if (this.selectedDates.has(dateString)) {
      this.selectedDates.delete(dateString);
      console.log(`Deselected date: ${dateString}`);
    } else {
      this.selectedDates.add(dateString);
      console.log(`Selected date: ${dateString}`);
    }
  }

  getTotalVacationDays(): number {
    return this.totalVacationDays;
  }

  getUsedVacationDays(): number {
    return this.usedVacationDays;
  }

  getTotalFreeHours(): number {
    return this.totalFreeHours;
  }

  getUsedFreeHours(): number {
    return this.usedFreeHours;
  }

  getVacationDaysChangedEmitter() {
    return this.vacationDaysChanged.asObservable();
  }
}
