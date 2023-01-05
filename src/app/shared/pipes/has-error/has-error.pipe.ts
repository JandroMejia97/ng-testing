import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * A pipe that checks if a control has an error and has been touched
 */
@Pipe({
  name: 'hasError',
  pure: false,
})
export class HasErrorPipe implements PipeTransform {

  /**
   * Checks if a control has an error and has been touched
   *
   * @param control The control to check
   * @param error The error to check
   * @param path The path to the control
   * @returns True if the control has the error and has been touched, otherwise false
   */
  transform(control: AbstractControl, error: string, path?: string | (string | number)[]): boolean {
    return control?.touched && control?.hasError(error, path);
  }

}
