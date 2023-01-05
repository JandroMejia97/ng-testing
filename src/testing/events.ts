import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import { query, queryByTestId } from './finders';

/**
 * Triggers an event handler on an element
 *
 * @param fixture The fixture of the component
 * @param selector The selector of the element
 * @param eventName The name of the event
 * @param eventObj The event object
 */
export function triggerEventHandler<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  eventName: string,
  withTestId = false,
  eventObj: unknown = null
): void {
  let debugElement: DebugElement;
  if (withTestId) {
    debugElement = queryByTestId(fixture, selector);
  } else {
    debugElement = query(fixture, selector);
  }
  debugElement.triggerEventHandler(eventName, eventObj);
}

/**
 * Triggers a click event handler on an element
 *
 * @param fixture The fixture of the component
 * @param selector The selector of the element
 */
export function triggerClickEventHandler(
  fixture: ComponentFixture<unknown>,
  selector: string
): void {
  triggerEventHandler(fixture, selector, 'click');
}
