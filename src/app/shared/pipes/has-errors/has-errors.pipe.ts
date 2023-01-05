import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * A pipe that checks if a control has errors and has been touched
 */
@Pipe({
  name: 'hasErrors',
  pure: false,
})
export class HasErrorsPipe implements PipeTransform {

  /**
   * Checks if a control has errors and has been touched
   *
   * @param control The control to validate
   * @returns True if the control has errors and has been touched, otherwise false
   */
  transform(control: AbstractControl): boolean | null {
    if (control?.pristine || control?.disabled) {
      return null;
    }
    return control?.touched && (!!control?.errors);
  }

}
