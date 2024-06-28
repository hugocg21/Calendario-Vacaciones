import { Component, OnInit } from '@angular/core';
import { VacationService } from '../../services/vacation.service';

@Component({
  selector: 'app-vacation-summary',
  templateUrl: './vacation-summary.component.html',
  styleUrls: ['./vacation-summary.component.css']
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
    this.totalVacationDays = this.vacationService.getTotalVacationDays();
    this.usedVacationDays = this.vacationService.getUsedVacationDays();
    this.totalFreeHours = this.vacationService.getTotalFreeHours();
    this.usedFreeHours = this.vacationService.getUsedFreeHours();
  }
}
