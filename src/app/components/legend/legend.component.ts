import { Component } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css'],
})
export class LegendComponent {
  legendItems = [
    { color: '#4caf50', label: 'Días de Vacaciones' },
    { color: '#2196f3', label: 'Horas de Libre Disposición' },
    { color: '#fc6c62', label: 'Fin de Semana' },
    { color: '#ccc', label: 'Día Deshabilitado' },
  ];
}
