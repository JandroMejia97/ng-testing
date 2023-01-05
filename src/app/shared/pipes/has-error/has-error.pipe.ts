import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'hasError',
  pure: false,
})
export class HasErrorPipe implements PipeTransform {

  transform(control: AbstractControl, error: string, path?: string | (string | number)[]): boolean {
    return control?.touched && control?.hasError(error, path);
  }

}
