import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Person } from '@models/person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent {
  @Input() person!: Person;
  @Output('onSelect')
  onSelected = new EventEmitter<Person>();
  imc: number | null = null;

  calculateIMC(): void {
    this.imc = this.person.calculateIMC();
  }

  onPersonSelected(): void {
    this.onSelected.emit(this.person);
  }
}
