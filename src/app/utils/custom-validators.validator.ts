/* eslint-disable no-useless-escape */
import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      throw new Error("The form must have password and confirmPassword fields");
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMatch: true });
      return { passwordMatch: true };
    }
    confirmPassword.setErrors(null);
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
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const minLength = password.length >= 8;
    let validationError: ValidationErrors | null = null;
    if (!hasNumber || !hasLowercase || !hasUppercase || !hasSpecialCharacters || !minLength) {
      validationError = { strongPassword: true };
    }
    return validationError;
  }

  static atLeastOneNumber(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasNumber) {
      validationError = { atLeastOneNumber: true };
    }
    return validationError;
  }

  static atLeastOneLowercase(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasLowercase = /[a-z]/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasLowercase) {
      validationError = { atLeastOneLowercase: true };
    }
    return validationError;
  }

  static atLeastOneUppercase(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasUppercase) {
      validationError = { atLeastOneUppercase: true };
    }
    return validationError;
  }

  static atLeastOneSpecialCharacter(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    let validationError: ValidationErrors | null = null;
    if (!hasSpecialCharacters) {
      validationError = { atLeastOneSpecialCharacter: true };
    }
    return validationError;
  }
}
