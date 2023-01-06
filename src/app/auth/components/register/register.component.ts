import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';

import { CustomValidators } from '@utils';
import { UserService } from '@auth/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  subscription!: Subscription;
  status: 'loading' | 'error' | 'success' = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.subscription = this.formGroup.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe({
        next: () => {
          this.changeDetectorRef.markForCheck();
        },
      });
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
      this.status = 'loading';
      const value = this.formGroup.value;
      this.userService
        .create({
          ...value,
          avatar: 'https://i.pravatar.cc/150?img=1',
        })
        .subscribe({
          next: () => {
            this.status = 'success';
          },
          error: (err) => {
            this.status = 'error';
          },
          complete: () => {
            this.changeDetectorRef.markForCheck();
          }
        });
    } else {
      this.formGroup.markAllAsTouched();
      Object.values(this.formGroup.controls).forEach((control) =>
        control.markAsDirty()
      );
      this.formGroup.updateValueAndValidity();
      this.changeDetectorRef.markForCheck();
    }
  }

  get nameField(): FormControl {
    return this.formGroup?.get('name') as FormControl;
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
