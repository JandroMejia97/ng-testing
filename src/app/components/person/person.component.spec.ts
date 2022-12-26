import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('should have a paragraph with the text "Hello, World!" (using the Native API)', () => {
    const compiled = fixture.nativeElement;
    const p: HTMLElement = compiled.querySelector('p');
    expect(p.textContent?.trim().toLocaleLowerCase()).toContain('hello, world!');
  });

  it('should have a paragraph with the text "Hello, World!" (using the Debug API)', () => {
    const debugElement: DebugElement = fixture.debugElement;
    const compiled = debugElement.nativeElement;
    const p: HTMLElement = compiled.querySelector('p');
    expect(p.textContent?.trim().toLocaleLowerCase()).toContain('hello, world!');
  });

  it('should have a paragraph with the text "Hello, World!" (using the Debug API and By.css)', () => {
    const debugElement = fixture.debugElement;
    const pDebugElement: DebugElement  = debugElement.query(By.css('p'));
    const pNativeElement: HTMLElement = pDebugElement.nativeElement;
    expect(pNativeElement.textContent?.trim().toLocaleLowerCase()).toContain('hello, world!');
  });
});
