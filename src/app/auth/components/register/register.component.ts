import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, Subscription, tap } from 'rxjs';

import { CustomValidators } from '@utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  subscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.subscription = this.formGroup.valueChanges.pipe(
      distinctUntilChanged(),
      tap((value) => console.log(value))
    ).subscribe({
      next: () => {
        this.changeDetectorRef.markForCheck();
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(8),
            CustomValidators.atLeastOneLowercase,
            CustomValidators.atLeastOneUppercase,
            CustomValidators.atLeastOneNumber,
            CustomValidators.atLeastOneSpecialCharacter,
          ],
        ],
        confirmPassword: [null, [Validators.required]],
        checkTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: CustomValidators.passwordMatch,
      }
    );
  }

  register(event: Event) {
    event.preventDefault();
    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      /* this.usersService.create(value)
      .subscribe((rta) => {
        console.log(rta);
        // redirect
      }); */
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  get nameField(): FormControl {
    return this.formGroup?.get('name') as FormControl;
  }

  get lastNameField(): FormControl {
    return this.formGroup?.get('lastName') as FormControl;
  }

  get emailField(): FormControl {
    return this.formGroup?.get('email') as FormControl;
  }

  get passwordField(): FormControl {
    return this.formGroup?.get('password') as FormControl;
  }

  get confirmPasswordField(): FormControl {
    return this.formGroup?.get('confirmPassword') as FormControl;
  }

  get checkTermsField(): FormControl {
    return this.formGroup?.get('checkTerms') as FormControl;
  }
}
