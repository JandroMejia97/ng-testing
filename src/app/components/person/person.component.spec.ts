import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from '@models/person.model';
import { getTextContentBySelector, query, queryByDirective } from '@testing';

import { PersonComponent } from './person.component';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Tests without input', () => {
    it('should have a header with the text "Hello, World!" (using the Native API)', () => {
      const compiled = fixture.nativeElement;
      const p: HTMLElement = compiled.querySelector('h3');
      expect(p.textContent?.toLocaleLowerCase()).toContain('hello, world!');
    });

    it('should have a header with the text "Hello, World!" (using the Debug API)', () => {
      const debugElement: DebugElement = fixture.debugElement;
      const compiled = debugElement.nativeElement;
      const p: HTMLElement = compiled.querySelector('h3');
      expect(p.textContent?.toLocaleLowerCase()).toContain('hello, world!');
    });

    it('should have a header with the text "Hello, World!" (using the Debug API and By.css)', () => {
      const h3TextContent = getTextContentBySelector(fixture, 'h3');
      expect(h3TextContent?.toLocaleLowerCase()).toContain('hello, world!');
    });
  });

  describe('Tests with input', () => {
    beforeEach(() => {
      component.person = new Person(1, 'John', 'Doe', 30, 80, 1.8);

      // Act
      fixture.detectChanges();
    });

    it('should have a header with the text "Hello, {person.name}!"', () => {
      // Arrange
      const h3TextContent = getTextContentBySelector(fixture, 'h3');

      // Assert
      expect(h3TextContent).toContain(component.person.name);
    });

    it('should have a paragraph with the text "I\'m {person.age} years old"', () => {
      // Arrange
      const pTextContent = getTextContentBySelector(fixture, 'p');

      // Assert
      expect(pTextContent).toContain(component.person.age.toString());
    });

    it('should display a text with IMC when do click', () => {
      // Arrange
      const buttonDebugElement: DebugElement = query(
        fixture,
        'button[name="calculateIMC"]'
      );
      const clickSpy = spyOn(component, 'calculateIMC').and.callThrough();

      // Act
      buttonDebugElement.triggerEventHandler('click', null);
      fixture.detectChanges();

      // Assert
      const blockTextContent = getTextContentBySelector(fixture, 'blockquote');

      expect(clickSpy).toHaveBeenCalled();
      expect(blockTextContent).toContain(
        component.person.calculateIMC().toString()
      );
      expect(blockTextContent).toContain(component.person.castIMCToString());
    });

    it('should emit an event when do click', () => {
      // Arrange
      const buttonDebugElement: DebugElement = query(
        fixture,
        'button[name="selectPerson"]'
      );
      const clickSpy = spyOn(component, 'onPersonSelected').and.callThrough();

      let selectedPerson: Person | undefined;

      // Act
      component.onSelected.subscribe({
        next: (person: Person) => (selectedPerson = person),
      });
      buttonDebugElement.triggerEventHandler('click', null);
      fixture.detectChanges();

      // Assert
      expect(clickSpy).toHaveBeenCalled();
      expect(selectedPerson).toEqual(component.person);
    });
  });
});

@Component({
  template: `
    <app-person
      [person]="person"
      (onSelect)="onPersonSelected($event)">
    </app-person>
  `,
})
export class HostComponent {
  person: Person = new Person(1, 'John', 'Doe', 30, 80, 1.8);
  selectedPerson: Person | undefined;

  onPersonSelected(person: Person): void {
    this.selectedPerson = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a HostComponent', () => {
    expect(hostComponent).toBeTruthy();
  });

  describe('Tests for the Child Component', () => {
    let personDebugEle: DebugElement;

    beforeEach(() => {
      personDebugEle = queryByDirective(fixture, PersonComponent);
    });

    it('should have a PersonComponent as child', () => {
      expect(personDebugEle.componentInstance).toBeTruthy();
    });

    it('should have a PersonComponent with the same person as HostComponent', () => {
      expect(personDebugEle.componentInstance.person).toEqual(
        hostComponent.person
      );
    });

    it('should have a H3 with the same name like the person in HostComponent', () => {
      // Act
      fixture.detectChanges();
      const h3TextContent = getTextContentBySelector(fixture, 'h3');

      // Assert
      expect(h3TextContent).toContain(hostComponent.person.name);
    });

    it('should emit an event when do click', () => {
      // Arrange
      const button: DebugElement = query(
        fixture,
        'button[name="selectPerson"]'
      );

      const onChildEventSpy = spyOn(
        personDebugEle.componentInstance,
        'onPersonSelected'
      ).and.callThrough();
      const onEventHandlerSpy = spyOn(
        hostComponent,
        'onPersonSelected'
      ).and.callThrough();

      // Act
      button.triggerEventHandler('click', null);

      // Assert
      expect(onChildEventSpy).toHaveBeenCalled();
      expect(onEventHandlerSpy).toHaveBeenCalled();
      expect(hostComponent.selectedPerson).toEqual(hostComponent.person);
    });
  });
});
