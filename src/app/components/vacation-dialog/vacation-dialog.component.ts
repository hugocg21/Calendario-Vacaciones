import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vacation-dialog',
  templateUrl: './vacation-dialog.component.html',
  styleUrls: ['./vacation-dialog.component.css']
})
export class VacationDialogComponent {
  vacationType: string = 'vacation'; // 'vacation' or 'hours'
  hours: number = 0;
  canDelete: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VacationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // Comprobar si hay algo que borrar (vacaciones u horas)
    this.canDelete = this.data.type === 'vacation' || (this.data.type === 'hours' && this.data.hours > 0);
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
