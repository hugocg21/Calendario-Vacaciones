import { Component, OnInit } from '@angular/core';
import { VacationService } from '../../services/vacation.service';

@Component({
  selector: 'app-vacation-summary',
  templateUrl: './vacation-summary.component.html',
  styleUrls: ['./vacation-summary.component.css'],
})
export class VacationSummaryComponent implements OnInit {
  totalVacationDays: number = 0;
  usedVacationDays: number = 0;
  totalFreeHours: number = 0;
  usedFreeHours: number = 0;

  constructor(private vacationService: VacationService) {}

  ngOnInit() {
    this.updateSummary();
    this.vacationService.getVacationDaysChangedEmitter().subscribe(() => {
      this.updateSummary();
    });
  }

  updateSummary() {
    Promise.all([
      this.vacationService.getTotalVacationDays(),
      this.vacationService.getUsedVacationDays(),
      this.vacationService.getTotalFreeHours(),
      this.vacationService.getUsedFreeHours(),
    ]).then(([totalDays, usedDays, totalHours, usedHours]) => {
      this.totalVacationDays = totalDays;
      this.usedVacationDays = usedDays;
      this.totalFreeHours = totalHours;
      this.usedFreeHours = usedHours;
    });
  }
}
