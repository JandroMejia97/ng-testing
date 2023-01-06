/* eslint-disable no-useless-escape */
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';

import { UserService } from '@auth/services/user.service';

/**
 * A collection of custom validators
 */
export class CustomValidators {
  /**
   * A password validator that compares the password and confirmPassword fields
   * and checks if they match, if not it sets the error on the confirmPassword field.
   *
   * @param control The control to validate
   * @param passwordName The name of the password field
   * @param confirmPasswordName The name of the confirmPassword field
   * @returns An error map with the validation errors if any, otherwise null
   */
  static passwordMatch(
    control: AbstractControl,
    passwordName = 'password',
    confirmPasswordName = 'confirmPassword'
  ): ValidationErrors | null {
    const password = control.get(passwordName);
    const confirmPassword = control.get(confirmPasswordName);
    if (!password || !confirmPassword) {
      throw new Error(`The form must have '${passwordName}' and '${passwordName}' fields defined.`);
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMatch: true });
      return { passwordMatch: true };
    }
    return null;
  }

  /**
   * A password validator that requires the control value to contain:
   * * At least one number
   * * At least one lowercase letter
   * * At least one uppercase letter
   * * At least one special character
   * * A minimum length of 8 characters
   *
   * @param control The control to validate
   * @returns An error map with the validation errors if any, otherwise null
   */
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );
    const minLength = password?.length >= 8;
    let validationError: ValidationErrors | null = null;
    if (
      !hasNumber ||
      !hasLowercase ||
      !hasUppercase ||
      !hasSpecialCharacters ||
      !minLength
    ) {
      validationError = { strongPassword: true };
    }
    return validationError;
  }

  /**
   * A password validator that requires the control value to contain
   * at least one number.
   *
   * @param control The control to validate
   * @returns An error map with the validation errors if any, otherwise null
   */
  static atLeastOneNumber(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasNumber) {
      validationError = { atLeastOneNumber: true };
    }
    return validationError;
  }

  /**
   * A password validator that requires the control value to contain
   * at least one lowercase letter.
   *
   * @param control The control to validate
   * @returns An error map with the validation errors if any, otherwise null
   */
  static atLeastOneLowercase(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value;
    const hasLowercase = /[a-z]/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasLowercase) {
      validationError = { atLeastOneLowercase: true };
    }
    return validationError;
  }

  /**
   * A password validator that requires the control value to contain
   * at least one uppercase letter.
   *
   * @param control The control to validate
   * @returns An error map with the validation errors if any, otherwise null
   */
  static atLeastOneUppercase(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasUppercase) {
      validationError = { atLeastOneUppercase: true };
    }
    return validationError;
  }

  /**
   * A password validator that requires the control value to contain
   * at least one special character.
   *
   * @param control The control to validate
   * @returns An error map with the validation errors if any, otherwise null
   */
  static atLeastOneSpecialCharacter(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value;
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      password
    );
    let validationError: ValidationErrors | null = null;
    if (!hasSpecialCharacters) {
      validationError = { atLeastOneSpecialCharacter: true };
    }
    return validationError;
  }

  /**
   * Checks if the email is available
   *
   * @param userService Instance of UserService
   * @returns A function that returns an observable with the validation errors if any, otherwise null
   */
  static checkIfEmailExists(
    userService: UserService,
  ): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((email) => userService.isAvailableByEmail(email)),
        map((response) => {
          if (!response.isAvailable) {
            return { emailExists: true };
          }
          return null;
        })
      );
    };
  }
}
