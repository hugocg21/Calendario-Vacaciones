import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Vacation } from '../models/vacation.model';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
  private vacations: Vacation[] = [];
  private selectedDates: Set<string> = new Set();
  private totalVacationDays: number = 22;
  private usedVacationDays: number = 0;
  private totalFreeHours: number = 69.25;
  private usedFreeHours: number = 0;

  private vacationDaysChanged = new Subject<void>();

  constructor() {
    this.loadFromLocalStorage();
  }

  addVacation(date: Date, type: string, hours?: number) {
    this.vacations.push({ date, type, hours });
    this.selectedDates.add(date.toDateString());
    console.log(
      `Added vacation: ${date.toDateString()} with type: ${type} and hours: ${hours}`
    );
    if (type === 'vacation') {
      this.usedVacationDays++;
    } else if (type === 'hours' && hours) {
      this.usedFreeHours += hours;
    }
    this.vacationDaysChanged.next();
    this.saveToLocalStorage();
  }

  removeVacation(date: Date) {
    const index = this.vacations.findIndex(
      (v) => new Date(v.date).toDateString() === date.toDateString()
    );
    if (index > -1) {
      const vacation = this.vacations.splice(index, 1)[0];
      this.selectedDates.delete(date.toDateString());
      if (vacation.type === 'vacation') {
        this.usedVacationDays--;
      } else if (vacation.type === 'hours' && vacation.hours) {
        this.usedFreeHours -= vacation.hours;
      }
      this.vacationDaysChanged.next();
      this.saveToLocalStorage();
    }
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

  saveToLocalStorage() {
    localStorage.setItem('vacations', JSON.stringify(this.vacations));
    localStorage.setItem(
      'selectedDates',
      JSON.stringify(Array.from(this.selectedDates))
    );
    localStorage.setItem(
      'totalVacationDays',
      JSON.stringify(this.totalVacationDays)
    );
    localStorage.setItem(
      'usedVacationDays',
      JSON.stringify(this.usedVacationDays)
    );
    localStorage.setItem('totalFreeHours', JSON.stringify(this.totalFreeHours));
    localStorage.setItem('usedFreeHours', JSON.stringify(this.usedFreeHours));
  }

  loadFromLocalStorage() {
    const vacations = localStorage.getItem('vacations');
    if (vacations) {
      this.vacations = JSON.parse(vacations).map((v: Vacation) => ({
        ...v,
        date: new Date(v.date),
      }));
    }
    const selectedDates = localStorage.getItem('selectedDates');
    if (selectedDates) {
      this.selectedDates = new Set(JSON.parse(selectedDates));
    }
    const totalVacationDays = localStorage.getItem('totalVacationDays');
    if (totalVacationDays) {
      this.totalVacationDays = JSON.parse(totalVacationDays);
    }
    const usedVacationDays = localStorage.getItem('usedVacationDays');
    if (usedVacationDays) {
      this.usedVacationDays = JSON.parse(usedVacationDays);
    }
    const totalFreeHours = localStorage.getItem('totalFreeHours');
    if (totalFreeHours) {
      this.totalFreeHours = JSON.parse(totalFreeHours);
    }
    const usedFreeHours = localStorage.getItem('usedFreeHours');
    if (usedFreeHours) {
      this.usedFreeHours = JSON.parse(usedFreeHours);
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('vacations');
    localStorage.removeItem('selectedDates');
    localStorage.removeItem('totalVacationDays');
    localStorage.removeItem('usedVacationDays');
    localStorage.removeItem('totalFreeHours');
    localStorage.removeItem('usedFreeHours');
    this.vacations = [];
    this.selectedDates.clear();
    this.totalVacationDays = 22;
    this.usedVacationDays = 0;
    this.totalFreeHours = 69.25;
    this.usedFreeHours = 0;
    this.vacationDaysChanged.next();
  }

  private holidays: { date: string; name: string }[] = [
    { date: '2025-01-01', name: 'Año Nuevo' },
    { date: '2025-01-06', name: 'Día de Reyes' },
    { date: '2025-03-04', name: 'Carnaval' },
    { date: '2025-04-17', name: 'Jueves Santo' },
    { date: '2025-04-18', name: 'Viernes Santo' },
    { date: '2025-05-01', name: 'Día del Trabajador' },
    { date: '2025-06-30', name: 'San Pedro' },
    { date: '2025-08-15', name: 'Asunción de la Virgen' },
    { date: '2025-09-08', name: 'Días de Asturias' },
    { date: '2025-10-13', name: 'Día de la Hispanidad' },
    { date: '2025-12-08', name: 'Día de la Constitución' },
    { date: '2025-12-24', name: 'Noche Buena' },
    { date: '2025-12-25', name: 'Navidad' },
    { date: '2025-12-31', name: 'Noche Vieja' },
  ];

  isHoliday(date: Date): boolean {
    return this.holidays.some(
      (holiday) => holiday.date === moment(date).format('YYYY-MM-DD')
    );
  }

  getHolidayName(date: Date): string | undefined {
    const holiday = this.holidays.find(
      (h) => h.date === moment(date).format('YYYY-MM-DD')
    );
    return holiday ? holiday.name : undefined;
  }
}
