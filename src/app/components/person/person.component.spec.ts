import { ComponentFixture, TestBed } from '@angular/core/testing';

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

  it('should have a paragraph with the text "Hello, World!"', () => {
    const compiled = fixture.nativeElement;
    const p: HTMLElement = compiled.querySelector('p');
    expect(p.textContent?.trim().toLocaleLowerCase()).toContain('hello, world!');
  });
});
