import { FormControl, FormGroup } from "@angular/forms";
import { CustomValidators } from "./custom-validators.validator";

describe('CustomValidators', () => {
  describe('passwordMatch', () => {
    let formGroup: FormGroup;
    let passwordField: FormControl;
    let confirmPasswordField: FormControl;

    beforeEach(() => {
      formGroup = new FormGroup({
        password: new FormControl(null),
        confirmPassword: new FormControl(null),
      });
      passwordField = formGroup.get('password') as FormControl;
      confirmPasswordField = formGroup.get('confirmPassword') as FormControl;
    });

    it('should return null if the passwords match', () => {
      passwordField.setValue('12345678');
      confirmPasswordField.setValue('12345678');

      const result = CustomValidators.passwordMatch(formGroup);
      expect(result).toBeNull();
    });

    it('should return an error if the passwords do not match', () => {
      passwordField.setValue('12345678');
      confirmPasswordField.setValue('123456789');

      const result = CustomValidators.passwordMatch(formGroup);
      expect(result).toEqual({ passwordMatch: true });
    });

    it('should throw an error if the password field isn\'t defined', () => {
      formGroup.removeControl('password');

      expect(() => CustomValidators.passwordMatch(formGroup)).toThrowError();
    });

    it('should throw an error if the confirmPassword field isn\'t defined', () => {
      formGroup.removeControl('confirmPassword');

      expect(() => CustomValidators.passwordMatch(formGroup)).toThrowError();
    });
  });

  describe('Password validators', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl(null, [CustomValidators.strongPassword]);
    });

    describe('strongPassword', () => {
      it('should return null if the password is strong', () => {
        control.setValue('3D@aBcD!');

        const result = CustomValidators.strongPassword(control);
        expect(result).toBeNull();
      });

      it('should return an error if the password is only a number', () => {
        control.setValue('1234567');

        const result = CustomValidators.strongPassword(control);
        expect(result).toEqual({ strongPassword: true });
      });

      it('should return an error if the password is only a lowercase letter', () => {
        control.setValue('abcdefgh');

        const result = CustomValidators.strongPassword(control);
        expect(result).toEqual({ strongPassword: true });
      });

      it('should return an error if the password is only an uppercase letter', () => {
        control.setValue('ABCDEFGH');

        const result = CustomValidators.strongPassword(control);
        expect(result).toEqual({ strongPassword: true });
      });

      it('should return an error if the password is only a special character', () => {
        control.setValue('!@#$%^&*()');

        const result = CustomValidators.strongPassword(control);
        expect(result).toEqual({ strongPassword: true });
      });
    });

    describe('atLeastOneNumber', () => {
      it('should return null if the password has at least one number', () => {
        control.setValue('asx4sdf.');
        const result = CustomValidators.atLeastOneNumber(control);
        expect(result).toBeNull();
      });

      it('should return an error if the password does not have at least one number', () => {
        control.setValue('abcdefgh');
        const result = CustomValidators.atLeastOneNumber(control);
        expect(result).toEqual({ atLeastOneNumber: true });
      });
    });

    describe('atLeastOneLowercaseLetter', () => {
      it('should return null if the password has at least one lowercase letter', () => {
        control.setValue('ABCdEFGH');
        const result = CustomValidators.atLeastOneLowercase(control);
        expect(result).toBeNull();
      });

      it('should return an error if the password does not have at least one lowercase letter', () => {
        control.setValue('ABCDEFGH');
        const result = CustomValidators.atLeastOneLowercase(control);
        expect(result).toEqual({ atLeastOneLowercase: true });
      });
    });

    describe('atLeastOneUppercaseLetter', () => {
      it('should return null if the password has at least one uppercase letter', () => {
        control.setValue('abcDefgh');
        const result = CustomValidators.atLeastOneUppercase(control);
        expect(result).toBeNull();
      });

      it('should return an error if the password does not have at least one uppercase letter', () => {
        control.setValue('abcdefgh');
        const result = CustomValidators.atLeastOneUppercase(control);
        expect(result).toEqual({ atLeastOneUppercase: true });
      });
    });

    describe('atLeastOneSpecialCharacter', () => {
      it('should return null if the password has at least one special character', () => {
        control.setValue('abcDefgh$');
        const result = CustomValidators.atLeastOneSpecialCharacter(control);
        expect(result).toBeNull();
      });

      it('should return an error if the password does not have at least one special character', () => {
        control.setValue('abcdefgh');
        const result = CustomValidators.atLeastOneSpecialCharacter(control);
        expect(result).toEqual({ atLeastOneSpecialCharacter: true });
      });
    });

  });


});
