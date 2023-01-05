import { waitForAsync } from "@angular/core/testing";
import { asyncData, asyncError, promiseData, promiseError } from "./async-data";

describe('AsyncData', () => {
  let data: unknown;

  it('should create an observable that emits the given data and completes immediately', waitForAsync(() => {
    data = { foo: 'bar' };
    asyncData(data).subscribe({
      next: (result) => {
        expect(result).toEqual(data);
      }
    });
  }));

  it('should raise an async error', waitForAsync(() => {
    const error = new Error('async error');
    asyncError(error).subscribe({
      error: (result) => {
        expect(result).toEqual(error);
      }
    });
  }));

  it('should create a promise that resolves with the given data', waitForAsync(async () => {
    data = { foo: 'bar' };
    const result = await promiseData(data);
    expect(result).toEqual(data);
  }));

  it('should raise a promise error', waitForAsync(async () => {
    const error = new Error('promise error');
    try {
      await promiseError(error);
    } catch (result) {
      expect(result).toEqual(error);
    }
  }));
});
