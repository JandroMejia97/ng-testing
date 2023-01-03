import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

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
  `,
})
export class HostComponent {}

describe('HighlightDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let highlightDirective: HighlightDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, HighlightDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  /* it('should create an instance', () => {
    const directive = new HighlightDirective();
    expect(directive).toBeTruthy();
  }); */

  it('should have 2 elements with the highlight directive and one whitout it', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    const elementsWithoutDirective = fixture.debugElement.queryAll(By.css(':not([highlight])'));

    expect(elements.length).toBe(2);
    expect(elementsWithoutDirective.length).toBe(1);
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
});
