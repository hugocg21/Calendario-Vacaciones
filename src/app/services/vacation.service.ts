import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Vacation } from '../models/vacation.model';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
  private vacations: Vacation[] = [];
  private selectedDates: Set<string> = new Set();
  private totalVacationDays: number = 22;
  private usedVacationDays: number = 0;
  private totalFreeHours: number = 88.5;
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
    this.totalFreeHours = 88.5;
    this.usedFreeHours = 0;
    this.vacationDaysChanged.next();
  }
}

// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
// import { Vacation } from '../models/vacation.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class VacationService {
//   private vacationsByPerson: { [key: string]: Vacation[] } = {};
//   private selectedDatesByPerson: { [key: string]: Set<string> } = {};
//   private totalVacationDaysByPerson: { [key: string]: number } = {};
//   private usedVacationDaysByPerson: { [key: string]: number } = {};
//   private totalFreeHoursByPerson: { [key: string]: number } = {};
//   private usedFreeHoursByPerson: { [key: string]: number } = {};
//   private vacationDaysChanged = new Subject<void>();

//   constructor() {
//     this.loadFromLocalStorage();
//   }

//   initializePerson(person: string, totalVacationDays: number, totalFreeHours: number) {
//     if (!this.totalVacationDaysByPerson[person]) {
//       this.totalVacationDaysByPerson[person] = totalVacationDays;
//       this.usedVacationDaysByPerson[person] = 0;
//     }
//     if (!this.totalFreeHoursByPerson[person]) {
//       this.totalFreeHoursByPerson[person] = totalFreeHours;
//       this.usedFreeHoursByPerson[person] = 0;
//     }
//     if (!this.vacationsByPerson[person]) {
//       this.vacationsByPerson[person] = [];
//       this.selectedDatesByPerson[person] = new Set();
//     }
//   }

//   addVacation(person: string, date: Date, type: string, hours?: number) {
//     if (!this.vacationsByPerson[person]) {
//       this.vacationsByPerson[person] = [];
//       this.selectedDatesByPerson[person] = new Set();
//     }

//     this.vacationsByPerson[person].push({ date, type, hours });
//     this.selectedDatesByPerson[person].add(date.toDateString());
//     if (type === 'vacation') {
//       this.usedVacationDaysByPerson[person]++;
//     } else if (type === 'hours' && hours) {
//       this.usedFreeHoursByPerson[person] += hours;
//     }
//     this.vacationDaysChanged.next();
//     this.saveToLocalStorage();
//   }

//   removeVacation(person: string, date: Date) {
//     if (!this.vacationsByPerson[person]) return;

//     const index = this.vacationsByPerson[person].findIndex(v => new Date(v.date).toDateString() === date.toDateString());
//     if (index > -1) {
//       const vacation = this.vacationsByPerson[person].splice(index, 1)[0];
//       this.selectedDatesByPerson[person].delete(date.toDateString());
//       if (vacation.type === 'vacation') {
//         this.usedVacationDaysByPerson[person]--;
//       } else if (vacation.type === 'hours' && vacation.hours) {
//         this.usedFreeHoursByPerson[person] -= vacation.hours;
//       }
//       this.vacationDaysChanged.next();
//       this.saveToLocalStorage();
//     }
//   }

//   getVacations(person: string): Vacation[] {
//     return this.vacationsByPerson[person] || [];
//   }

//   isSelected(person: string, date: Date): boolean {
//     return this.selectedDatesByPerson[person]?.has(date.toDateString()) || false;
//   }

//   getTotalVacationDays(person: string): number {
//     return this.totalVacationDaysByPerson[person] || 0;
//   }

//   getUsedVacationDays(person: string): number {
//     return this.usedVacationDaysByPerson[person] || 0;
//   }

//   getTotalFreeHours(person: string): number {
//     return this.totalFreeHoursByPerson[person] || 0;
//   }

//   getUsedFreeHours(person: string): number {
//     return this.usedFreeHoursByPerson[person] || 0;
//   }

//   getVacationDaysChangedEmitter() {
//     return this.vacationDaysChanged.asObservable();
//   }

//   saveToLocalStorage() {
//     localStorage.setItem('vacationsByPerson', JSON.stringify(this.vacationsByPerson));
//     localStorage.setItem('selectedDatesByPerson', JSON.stringify(this.selectedDatesByPerson));
//     localStorage.setItem('totalVacationDaysByPerson', JSON.stringify(this.totalVacationDaysByPerson));
//     localStorage.setItem('usedVacationDaysByPerson', JSON.stringify(this.usedVacationDaysByPerson));
//     localStorage.setItem('totalFreeHoursByPerson', JSON.stringify(this.totalFreeHoursByPerson));
//     localStorage.setItem('usedFreeHoursByPerson', JSON.stringify(this.usedFreeHoursByPerson));
//   }

//   loadFromLocalStorage() {
//     const vacationsByPerson = localStorage.getItem('vacationsByPerson');
//     if (vacationsByPerson) {
//       this.vacationsByPerson = JSON.parse(vacationsByPerson);
//     }
//     const selectedDatesByPerson = localStorage.getItem('selectedDatesByPerson');
//     if (selectedDatesByPerson) {
//       this.selectedDatesByPerson = JSON.parse(selectedDatesByPerson);
//     }
//     const totalVacationDaysByPerson = localStorage.getItem('totalVacationDaysByPerson');
//     if (totalVacationDaysByPerson) {
//       this.totalVacationDaysByPerson = JSON.parse(totalVacationDaysByPerson);
//     }
//     const usedVacationDaysByPerson = localStorage.getItem('usedVacationDaysByPerson');
//     if (usedVacationDaysByPerson) {
//       this.usedVacationDaysByPerson = JSON.parse(usedVacationDaysByPerson);
//     }
//     const totalFreeHoursByPerson = localStorage.getItem('totalFreeHoursByPerson');
//     if (totalFreeHoursByPerson) {
//       this.totalFreeHoursByPerson = JSON.parse(totalFreeHoursByPerson);
//     }
//     const usedFreeHoursByPerson = localStorage.getItem('usedFreeHoursByPerson');
//     if (usedFreeHoursByPerson) {
//       this.usedFreeHoursByPerson = JSON.parse(usedFreeHoursByPerson);
//     }
//   }

//   clearLocalStorage() {
//     localStorage.removeItem('vacationsByPerson');
//     localStorage.removeItem('selectedDatesByPerson');
//     localStorage.removeItem('totalVacationDaysByPerson');
//     localStorage.removeItem('usedVacationDaysByPerson');
//     localStorage.removeItem('totalFreeHoursByPerson');
//     localStorage.removeItem('usedFreeHoursByPerson');
//     this.vacationsByPerson = {};
//     this.selectedDatesByPerson = {};
//     this.totalVacationDaysByPerson = {};
//     this.usedVacationDaysByPerson = {};
//     this.totalFreeHoursByPerson = {};
//     this.usedFreeHoursByPerson = {};
//     this.vacationDaysChanged.next();
//   }
// }
