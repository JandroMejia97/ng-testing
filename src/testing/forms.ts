import { ComponentFixture } from '@angular/core/testing';

import { query } from './finders';

/**
 * Search for an element and set the given value on it. Also triggers the
 * input and blur events.
 *
 * @param fixture The fixture of the component to query
 * @param selector The CSS selector of the element to query
 * @param value The value to set
 * @param withTestId Whether to use the test id or not
 */
export function searchAndSetValueOnInputElement(
  fixture: ComponentFixture<unknown>,
  selector: string,
  value: string,
  withTestId = false
): void {
  const debugElement = query(fixture, selector, withTestId);
  setValueOnInputElement(debugElement.nativeElement, value);
}

/**
 * Set the given value on an input element. Also triggers the input and blur
 *
 * @param element The element to set the value on
 * @param value The value to set
 */
export function setValueOnInputElement(
  element: HTMLInputElement,
  value: string
): void {
  element.value = value;
  element.dispatchEvent(new Event('input'));
  element.dispatchEvent(new Event('blur'));
}

/**
 * Search for an element and set the given value on it. Also triggers the
 * input and blur events.
 *
 * @param fixture The fixture of the component to query
 * @param selector The CSS selector of the element to query
 * @param value The value to set
 * @param withTestId Whether to use the test id or not
 */
export function searchAndSetValueOnCheckboxElement(
  fixture: ComponentFixture<unknown>,
  selector: string,
  value: boolean,
  withTestId = false
): void {
  const debugElement = query(fixture, selector, withTestId);
  setValueOnCheckboxElement(debugElement.nativeElement, value);
}

/**
 * Set the given value on an input element. Also triggers the input and blur
 *
 * @param element The element to set the value on
 * @param value The value to set
 */
export function setValueOnCheckboxElement(
  element: HTMLInputElement,
  value: boolean,
): void {
  element.checked = value;
  element.dispatchEvent(new Event('change'));
  element.dispatchEvent(new Event('blur'));
}
