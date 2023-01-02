import { Component } from '@angular/core';
import { generateManyPeople } from '@models/mocks/person.mock';
import { Person } from '@models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  people: Person[] = generateManyPeople(2);
  selectedPerson: Person | null = null;

  choosePerson(person: Person): void {
    this.selectedPerson = person;
  }
}
