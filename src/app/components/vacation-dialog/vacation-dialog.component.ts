import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vacation-dialog',
  templateUrl: './vacation-dialog.component.html',
  styleUrls: ['./vacation-dialog.component.css']
})
export class VacationDialogComponent {
  vacationType: string = 'vacation'; // 'vacation' or 'hours'
  hours: number = 0;

  constructor(public dialogRef: MatDialogRef<VacationDialogComponent>) {}

  onSubmit() {
    if (this.vacationType === 'vacation') {
      this.dialogRef.close({ type: 'vacation' });
    } else {
      this.dialogRef.close({ type: 'hours', hours: this.hours });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
