import { TestBed, waitForAsync } from '@angular/core/testing';

import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;
  const testValue = 'Testing';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService]
    });
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getter', () => {
    it(`should return a value distinct of "${testValue}"`, () => {
      expect(service.value).not.toBe(testValue);
    });

    it(`should return a value equal to "Example"`, () => {
      expect(service.value).toBe(service.value);
    });

  });

  describe('Tests for setter', () => {
    it(`should change the value and return "${testValue}"`, () => {
      expect(service.value).not.toBe(testValue);
      service.value = testValue;
      expect(service.value).toBe(testValue);
    });
  });

  describe('Test for promise', () => {
    it(`should resolve the promise and return "Example", using "waitForAsync"`, waitForAsync(() => {
      service.promiseValue.then((value) => {
        expect(value).toBe(service.value);
      })
    }));
  });

  describe('Test for observables', () => {
    it(`should use an observable and return "Example", using "waitForAsync"`, waitForAsync(() => {
      service.observableValue.subscribe({
        next: (value) => {
          expect(value).toBe(service.value);
        }
      });
    }));
  });
});
