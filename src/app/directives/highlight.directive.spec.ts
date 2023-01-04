import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

describe('HighlightDirective', () => {
  let directive: HighlightDirective;
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    directive = new HighlightDirective({ nativeElement: element });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have the default color when it isn\'t defined', () => {
    expect(element.style.backgroundColor).toBe(directive.defaultColor);
  });

  it('should have the color defined', () => {
    directive.highlight = 'yellow';
    expect(element.style.backgroundColor).toBe('yellow');
  });
});

@Component({
  template: `
    <p highlight>
      With highlight directive and a default color
    </p>
    <p highlight="yellow">
      With highlight directive and a yellow color
    </p>
    <p>
      Without highlight directive
    </p>
    <input [(ngModel)]="color" type="text" id="input"/>
    <p highlight [highlight]="color">
      With highlight directive and a color defined in the input
    </p>
  `,
})
class HostComponent {
  color = 'pink';
}

describe('HighlightDirective with HostComponent', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HighlightDirective, HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should have 3 elements with the highlight directive and 2 whitout it', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    const elementsWithoutDirective = fixture.debugElement.queryAll(By.css(':not([highlight])'));

    expect(elements.length).toBe(3);
    expect(elementsWithoutDirective.length).toBe(2);
  });

  it('should have the default color when it isn\'t defined', () => {
    const element = fixture.debugElement.queryAll(By.directive(HighlightDirective))[0];
    const directive = element.injector.get(HighlightDirective);

    expect(element.nativeElement.style.backgroundColor).toBe(directive.defaultColor);
  });

  it('should have the color defined', () => {
    const element = fixture.debugElement.queryAll(By.directive(HighlightDirective))[1];

    expect(element.nativeElement.style.backgroundColor).toBe('yellow');
  });

  it('should bind the color defined in the input and change it', () => {
    const elementDebug = fixture.debugElement.queryAll(By.directive(HighlightDirective))[2];
    const element: HTMLParagraphElement = elementDebug.nativeElement;
    const inputDebug = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebug.nativeElement;

    expect(elementDebug.nativeElement.style.backgroundColor).toBe('pink');

    inputElement.value = 'blue';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(element.style.backgroundColor).toBe('blue');
    expect(hostComponent.color).toBe('blue');
  });
});
