import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { VacationFormComponent } from './components/vacation-form/vacation-form.component';
import { VacationSummaryComponent } from './components/vacation-summary/vacation-summary.component';
import { MyCalendarComponent } from './components/my-calendar/my-calendar.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'form', component: VacationFormComponent },
  { path: 'summary', component: VacationSummaryComponent },
  { path: 'my-calendar', component: MyCalendarComponent },
  { path: '', redirectTo: '/my-calendar', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
