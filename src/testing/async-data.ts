import { defer, of, throwError } from 'rxjs';

/**
 * Creates an observable that emits the given data and completes immediately.
 * @param data The data to emit.
 * @returns An observable that emits the given data and completes immediately.
 */
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

/**
 * Creates an observable that emits the given error and completes immediately.
 * @param errorObject The error to emit.
 * @returns An observable that emits the given error and completes immediately.
 */
export function asyncError(errorObject: unknown) {
  return defer(() => Promise.reject(errorObject));
}

/**
 * Creates a promise that resolves with the given data.
 * @param data The data to resolve with.
 * @returns A promise that resolves with the given data.
 */
export function promiseData<T>(data: T) {
  return Promise.resolve(data);
}

/**
 * Creates a promise that rejects with the given error.
 * @param errorObject The error to reject with.
 * @returns A promise that rejects with the given error.
 */
export function promiseError(errorObject: unknown) {
  return Promise.reject(errorObject);
}

/**
 * Creates an observable that emits the given data and completes immediately.
 * @param data The data to emit.
 * @returns An observable that emits the given data and completes immediately.
 */
export function observableData<T>(data: T) {
  return of(data);
}

/**
 * Creates an observable that emits the given error and completes immediately.
 * @param errorObject The error to emit.
 * @returns An observable that emits the given error and completes immediately.
 */
export function observableError(errorObject: unknown) {
  return throwError(() => errorObject);
}
