import { DebugElement, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Query a component (or element) by its Test ID
 *
 * @param fixture The fixture of the component to query
 * @param testId The Test ID of the element to query
 * @returns The element with the given Test ID
 */
export function queryByTestId<T>(
  fixture: ComponentFixture<T>,
  testId: string
): DebugElement {
  const selector = `[data-testid="${testId}"]`;
  return fixture.debugElement.query(By.css(selector));
}

/**
 * Query a component (or element) by its CSS selector
 *
 * @param fixture The fixture of the component to query
 * @param selector The CSS selector of the element to query
 * @returns The element with the given CSS selector
 */
export function query<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

/**
 * Query all components (or elements) by their CSS selector.
 *
 * @param fixture The fixture of the component to query
 * @param selector The CSS selector of the element to query
 * @returns
 */
export function queryAll<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

/**
 * Query a component (or directive) by its type (class)
 *
 * @param fixture The fixture of the component to query
 * @param directive The directive to query
 * @returns The element with the given directive
 */
export function queryByDirective<T, U>(
  fixture: ComponentFixture<T>,
  directive: Type<U>
): DebugElement {
  return fixture.debugElement.query(By.directive(directive));
}

/**
 * Query all components (or directives) by their type (class)
 *
 * @param fixture The fixture of the component to query
 * @param directive The directive to query
 * @returns The elements with the given directive
 */
export function queryAllByDirective<T, U>(
  fixture: ComponentFixture<T>,
  directive: Type<U>
): DebugElement[] {
  return fixture.debugElement.queryAll(By.directive(directive));
}

/**
 * Get the text content of an element with the given selector
 *
 * @param fixture The fixture of the component to query
 * @param selector The CSS selector of the element to query
 * @returns The text content of the element with the given CSS selector
 */
export function getTextContentBySelector<T>(
  fixture: ComponentFixture<T>,
  selector: string
): string {
  return query(fixture, selector).nativeElement.textContent;
}
