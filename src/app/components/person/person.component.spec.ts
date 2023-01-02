import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from '@models/person.model';

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
      const debugElement = fixture.debugElement;
      const pDebugElement: DebugElement  = debugElement.query(By.css('h3'));
      const pNativeElement: HTMLElement = pDebugElement.nativeElement;
      expect(pNativeElement.textContent?.toLocaleLowerCase()).toContain('hello, world!');
    });
  });

  describe('Tests with input', () => {
    beforeEach(() => {
      component.person = new Person(1, 'John', 'Doe', 30, 80, 1.80);

      // Act
      fixture.detectChanges();
    });

    it('should have a header with the text "Hello, {person.name}!"', () => {
      // Arrange
      const debugElement = fixture.debugElement;
      const pDebugElement: DebugElement  = debugElement.query(By.css('h3'));
      const pNativeElement: HTMLElement = pDebugElement.nativeElement;

      // Assert
      expect(pNativeElement.textContent).toContain(component.person.name);
    });

    it('should have a paragraph with the text "I\'m {person.age} years old"', () => {
      // Arrange
      const debugElement = fixture.debugElement;
      const pDebugElement: DebugElement  = debugElement.query(By.css('p'));
      const pNativeElement: HTMLElement = pDebugElement.nativeElement;

      // Assert
      expect(pNativeElement.textContent).toContain(component.person.age);
    });

    it('should display a text with IMC when do click', () => {
      // Arrange
      const debugElement = fixture.debugElement;
      const buttonDebugElement: DebugElement  = debugElement.query(By.css('button[name="calculateIMC"]'));      const clickSpy = spyOn(component, 'calculateIMC').and.callThrough();

      // Act
      buttonDebugElement.triggerEventHandler('click', null);
      fixture.detectChanges();

      // Assert
      const blockDebugElement: DebugElement  = debugElement.query(By.css('blockquote'));
      const blockNativeElement: HTMLElement = blockDebugElement.nativeElement;

      expect(clickSpy).toHaveBeenCalled();
      expect(blockNativeElement.textContent).toContain(component.person.calculateIMC());
      expect(blockNativeElement.textContent).toContain(component.person.castIMCToString());
    });

    it('should emit an event when do click', () => {
      // Arrange
      const debugElement = fixture.debugElement;
      const buttonDebugElement: DebugElement  = debugElement.query(By.css('button[name="selectPerson"]'));
      const clickSpy = spyOn(component, 'onPersonSelected').and.callThrough();

      let selectedPerson: Person | undefined;

      // Act
      component.onSelected.subscribe({
        next: (person: Person) => selectedPerson = person
      });
      buttonDebugElement.triggerEventHandler('click', null);
      fixture.detectChanges();

      // Assert
      expect(clickSpy).toHaveBeenCalled();
      expect(selectedPerson).toEqual(component.person);
    });
  });
});
