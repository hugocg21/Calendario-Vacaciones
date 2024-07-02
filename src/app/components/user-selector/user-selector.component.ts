import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css'],
})
export class UserSelectorComponent {
  @Input() persons: string[] = [];
  @Input() selectedPerson: string = '';
  @Output() selectedPersonChange = new EventEmitter<string>();

  onPersonChange(person: string) {
    this.selectedPersonChange.emit(person);
  }
}
