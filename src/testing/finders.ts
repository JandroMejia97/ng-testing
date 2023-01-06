import { DebugElement, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Query a component (or element) by its CSS selector
 *
 * @param fixture The fixture of the component to query
 * @param selector The CSS selector of the element to query
 * @param withTestId Whether to use the test id or not
 * @returns The element with the given CSS selector
 */
export function query<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  withTestId = false
): DebugElement {
  if (withTestId) {
    selector = `[data-testId="${selector}"]`;
  }
  const debugElement = fixture.debugElement.query(By.css(selector));
  if (!debugElement) {
    throw new Error(`Could not find element with selector: ${selector}`);
  }
  return debugElement;
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
  const debugElement = fixture.debugElement.query(By.directive(directive));
  if (!debugElement) {
    throw new Error(`Could not find element with directive: ${directive.name}`);
  }
  return debugElement;
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
 * @param withTestId Whether to use the test id or not
 * @returns The text content of the element with the given CSS selector
 */
export function getTextContentBySelector<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  withTestId = false
): string {
  return query(fixture, selector, withTestId).nativeElement.textContent;
}
