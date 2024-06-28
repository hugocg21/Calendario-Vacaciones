import { Component } from '@angular/core';
import { VacationService } from '../../services/vacation.service';

@Component({
  selector: 'app-vacation-form',
  templateUrl: './vacation-form.component.html',
  styleUrls: ['./vacation-form.component.css']
})
export class VacationFormComponent {
  vacationDays: number = 22;
  freeHours: number = 88.5;

  constructor(private vacationService: VacationService) {}

  onSubmit() {
    // Puedes agregar lógica adicional si es necesario
    const date = new Date(); // Esto es solo un ejemplo. Puedes obtener la fecha de alguna manera.
    this.vacationService.addVacation(date, 'vacation', this.freeHours);
    console.log('Días de vacaciones:', this.vacationDays);
    console.log('Horas de libre disposición:', this.freeHours);
  }
}
