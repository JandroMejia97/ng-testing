import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { triggerClickEventOnElement, triggerEventHandler } from "./events";
import { query } from "./finders";

@Component({
  template: `
    <button data-testid="testButton" (click)="onClick()">
      Click me!
    </button>
  `,
})
class HostComponent {
  onClick() {
    console.log('Clicked!');
  }
}

describe('Events', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should trigger click event', () => {
    const componentSpy = spyOn(component, 'onClick');

    triggerEventHandler(fixture, 'button', 'click', false, null);

    expect(componentSpy).toHaveBeenCalled();
  });

  it('should trigger click event with TestId', () => {
    const componentSpy = spyOn(component, 'onClick');

    triggerEventHandler(fixture, 'testButton', 'click', true, null);

    expect(componentSpy).toHaveBeenCalled();
  });

  it('should trigger click event in the element', () => {
    const button = query(fixture, 'button');
    const buttonSpy = spyOn(button.nativeElement, 'click');

    triggerClickEventOnElement(fixture, 'button', false);

    expect(buttonSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger click event in the element with TestId', () => {
    const button = query(fixture, 'button');
    const buttonSpy = spyOn(button.nativeElement, 'click');

    triggerClickEventOnElement(fixture, 'testButton', true);

    expect(buttonSpy).toHaveBeenCalledTimes(1);
  });
});
