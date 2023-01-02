import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PersonComponent } from '@components/person/person.component';
import { generateManyPeople } from '@models/mocks/person.mock';

import { PeopleComponent } from './people.component';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of "app-person" components', () => {
    // Arrange
    component.people = generateManyPeople(3);

    // Act
    fixture.detectChanges();
    const personDebugElements = fixture.debugElement.queryAll(By.directive(PersonComponent));

    // Assert
    expect(personDebugElements.length).toBe(3);
  });

  it('should change the selected person when a person is selected', () => {
    // Arrange
    const firstButtonDebugElement = fixture.debugElement.query(By.css('button[name="selectPerson"]'));

    // Act
    firstButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    expect(component.selectedPerson).toBe(component.people[0]);
  });

  it('should show the selected person when a person is selected', () => {
    // Arrange
    const firstButtonDebugElement = fixture.debugElement.query(By.css('button[name="selectPerson"]'));

    // Act
    firstButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    const selectedPersonDebugElement = fixture.debugElement.query(By.css('.selected-person'));

    // Assert
    expect(selectedPersonDebugElement).toBeTruthy();
    expect(selectedPersonDebugElement.nativeElement.textContent).toContain(component.selectedPerson?.name);
  });
});
