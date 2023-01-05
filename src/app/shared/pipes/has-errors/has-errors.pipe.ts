import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'hasErrors',
  pure: false,
})
export class HasErrorsPipe implements PipeTransform {

  transform(control: AbstractControl): boolean | null {
    if (control?.pristine || control?.disabled) {
      return null;
    }
    return control?.touched && (!!control?.errors);
  }

}
