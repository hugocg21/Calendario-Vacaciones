import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomDateAdapter } from './adapters/custom-date-adapter'; // Importar desde la nueva carpeta
import { CalendarComponent } from './components/calendar/calendar.component';
import { VacationDialogComponent } from './components/vacation-dialog/vacation-dialog.component';
import { VacationFormComponent } from './components/vacation-form/vacation-form.component';
import { VacationSummaryComponent } from './components/vacation-summary/vacation-summary.component';
import { VacationService } from './services/vacation.service';
import { MyCalendarComponent } from './components/my-calendar/my-calendar.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    VacationFormComponent,
    VacationSummaryComponent,
    VacationDialogComponent,
    MyCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDialogModule,
    MatRadioModule,
    MatIconModule,
  ],
  providers: [
    VacationService,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
