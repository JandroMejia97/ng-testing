import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  #myValue = 'Example';

  get value(): string {
    return this.#myValue;
  }

  set value(value: string) {
    this.#myValue = value;
  }

  get promiseValue(): Promise<string> {
    return Promise.resolve(this.#myValue)
  }

  get observableValue(): Observable<string> {
    return of(this.#myValue)
  }
}
