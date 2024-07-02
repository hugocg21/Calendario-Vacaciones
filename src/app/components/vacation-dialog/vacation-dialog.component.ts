import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vacation-dialog',
  templateUrl: './vacation-dialog.component.html',
  styleUrls: ['./vacation-dialog.component.css'],
})
export class VacationDialogComponent {
  vacationType: string = 'vacation';
  hours: number = 0;
  canDelete: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VacationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.canDelete =
      this.data.type === 'vacation' ||
      (this.data.type === 'hours' && this.data.hours > 0);
    if (this.data.type === 'hours') {
      this.hours = this.data.hours;
    }
  }

  onSubmit() {
    if (this.vacationType === 'vacation') {
      this.dialogRef.close({ type: 'vacation' });
    } else {
      this.dialogRef.close({ type: 'hours', hours: this.hours });
    }
  }

  onDelete() {
    this.dialogRef.close({ delete: true });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
