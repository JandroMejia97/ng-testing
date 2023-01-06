import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { faker } from '@faker-js/faker';

import { UserService } from '@auth/services/user.service';
import { CreateUserDTO, User } from '@models/user.model';
import { SharedModule } from '@shared/shared.module';
import {
  setValueOnInputElement,
  query,
  observableData,
  observableError,
  searchAndSetValueOnInputElement,
  searchAndSetValueOnCheckboxElement,
  triggerClickEventOnElement,
} from '@testing';

import { RegisterComponent } from './register.component';
import { Router, RouterModule } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', [
      'create',
      'isAvailableByEmail',
    ]);

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, SharedModule, RouterModule, HttpClientTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: userServiceSpyObj,
        },
        {
          provide: Router,
          useValue: routerSpyObj,
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    // UserService spy
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userServiceSpy.isAvailableByEmail.and.returnValue(
      observableData({ isAvailable: true })
    );

    // Router spy
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Tests for FormGroup', () => {
    it('should be invalid when empty', () => {
      expect(component.formGroup.valid).toBeFalsy();
    });

    describe('Group', () => {
      it('should be invalid', () => {
        const group = component.formGroup;
        let textContext = 'FormGroup is not defined';

        expect(group.valid).withContext(textContext).toBeFalsy();

        group.setValue({
          name: 'test',
          email: 'test@test.com',
          password: 'Test1234',
          confirmPassword: 'Test1234',
          checkTerms: false,
        });

        textContext = 'The terms are not accepted';
        expect(group.valid).withContext(textContext).toBeFalsy();
        expect(component.checkTermsField.hasError('required'))
          .withContext(textContext)
          .toBeTruthy();

        group.setValue({
          name: 'test',
          email: 'test@test.com',
          password: 'Test1234',
          confirmPassword: 'Tes1234',
          checkTerms: true,
        });

        textContext = "The passwords don't match";
        expect(group.valid).withContext(textContext).toBeFalsy();
        expect(group.hasError('passwordMatch'))
          .withContext(textContext)
          .toBeTruthy();
      });

      it('should be valid', () => {
        const group = component.formGroup;
        group.setValue({
          name: 'test',
          email: 'test@test.com',
          password: 'Test1234',
          confirmPassword: 'Test1234',
          checkTerms: true,
        });

        expect(group.valid).toBeTruthy();
      });
    });

    describe('Email', () => {
      it('should be invalid', () => {
        const email = component.emailField;

        expect(email.valid).withContext('Email is not defined').toBeFalsy();
        expect(email.hasError('required')).toBeTruthy();

        email.setValue('   ');
        expect(email.valid).withContext('The field is blank').toBeFalsy();
        expect(email.hasError('email')).toBeTruthy();

        email.setValue('test');
        expect(email.valid).withContext('The email is invalid').toBeFalsy();
        expect(email.hasError('email')).toBeTruthy();
      });

      it('should be valid', () => {
        const email = component.emailField;
        email.setValue('a@a.com');
        expect(email.valid).toBeTruthy();
      });
    });

    describe('Password', () => {
      it('should be invalid', () => {
        let passwordValue = '1234567';
        const password = component.passwordField;

        expect(password.valid)
          .withContext('Password is not defined')
          .toBeFalsy();
        expect(password.hasError('required')).toBeTruthy();

        password.setValue(passwordValue);
        expect(password.valid)
          .withContext(`The password is the number (${passwordValue})`)
          .toBeFalsy();
        expect(password.hasError('minlength'))
          .withContext('The password is too short')
          .toBeTruthy();
        expect(password.hasError('atLeastOneLowercase'))
          .withContext("The password doesn't have a lowercase letter")
          .toBeTruthy();
        expect(password.hasError('atLeastOneUppercase'))
          .withContext("The password doesn't have a uppercase letter")
          .toBeTruthy();

        passwordValue = 'AAAAAAAAA';
        password.setValue(passwordValue);
        expect(password.valid)
          .withContext(`The password is the uppercase (${passwordValue})`)
          .toBeFalsy();
        expect(password.hasError('atLeastOneLowercase'))
          .withContext("The password doesn't have a lowercase letter")
          .toBeTruthy();
        expect(password.hasError('atLeastOneNumber'))
          .withContext("The password doesn't have a number")
          .toBeTruthy();

        passwordValue = 'aaaaaaaaa';
        password.setValue(passwordValue);
        expect(password.valid)
          .withContext(`The password is the lowercase (${passwordValue})`)
          .toBeFalsy();
        expect(password.hasError('atLeastOneNumber'))
          .withContext("The password doesn't have a number")
          .toBeTruthy();
        expect(password.hasError('atLeastOneUppercase'))
          .withContext("The password doesn't have a uppercase letter")
          .toBeTruthy();
      });

      it('should be valid', () => {
        const password = component.passwordField;
        const passwordValue = '1A345678a';
        password.setValue(passwordValue);
        expect(password.valid)
          .withContext(`The password is valid (${passwordValue})`)
          .toBeTruthy();
      });
    });
  });

  describe('Tests for FormGroup from UI', () => {
    let textContext: string;

    describe('Email', () => {
      let emailDebug: DebugElement;

      beforeEach(() => {
        emailDebug = query(fixture, '#email');
      });

      it('should be invalid', () => {
        // Empty email
        const emailNative: HTMLInputElement = emailDebug.nativeElement;
        setValueOnInputElement(emailNative, '');

        fixture.detectChanges();
        let errorNative: HTMLElement = query(
          fixture,
          'email-required',
          true
        ).nativeElement;

        textContext = `Check the aria-invalid attribute should be true`;
        expect(emailNative.getAttribute('aria-invalid'))
          .withContext(textContext)
          .toBe('true');

        textContext = 'Check if there is an error message';
        expect(errorNative).withContext(textContext).toBeTruthy();

        textContext = 'Check if error message contains the word "required"';
        expect(errorNative?.textContent?.trim().toLowerCase()).toContain(
          'required'
        );

        // Invalid email
        setValueOnInputElement(emailNative, 'test');

        fixture.detectChanges();
        errorNative = query(fixture, 'email-invalid', true).nativeElement;

        textContext = `Check the aria-invalid attribute should be true`;
        expect(emailNative.getAttribute('aria-invalid'))
          .withContext(textContext)
          .toBe('true');

        textContext = 'Check if there is an error message';
        expect(errorNative).withContext(textContext).toBeTruthy();
      });

      it('should be valid', () => {
        const emailNative: HTMLInputElement = emailDebug.nativeElement;
        setValueOnInputElement(emailNative, 'test@test.com');

        fixture.detectChanges();

        textContext = `Check the aria-invalid attribute should be false`;
        expect(emailNative.getAttribute('aria-invalid'))
          .withContext(textContext)
          .toBe('false');
      });

      it('should be show a message if the email is already registered', fakeAsync(() => {
        const emailNative: HTMLInputElement = emailDebug.nativeElement;
        const email = 'test@test.com';
        userServiceSpy.isAvailableByEmail.and.returnValue(
          observableData({ isAvailable: false })
        );
        setValueOnInputElement(emailNative, email);

        fixture.detectChanges();
        tick();

        const errorNative: HTMLElement = query(
          fixture,
          'email-exists',
          true
        ).nativeElement;

        textContext = 'Method "isAvailableByEmail" should be called';
        expect(userServiceSpy.isAvailableByEmail).withContext(textContext).toHaveBeenCalledWith(email);
        textContext = 'Check if there is an error message';
        expect(errorNative).withContext(textContext).toBeDefined();
        expect(userServiceSpy.isAvailableByEmail).toHaveBeenCalledWith(email);
      }));
    });
  });

  describe('Tests for "register"', () => {
    const password = '1A345678a';
    let mockData: CreateUserDTO & {
      confirmPassword: string;
      checkTerms: boolean;
      avatar: string;
    };
    let mockUser: User;

    beforeEach(() => {
      mockUser = {
        password,
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
      };

      mockData = {
        password,
        name: faker.name.firstName(),
        email: faker.internet.email(),
        confirmPassword: password,
        checkTerms: true,
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
    });

    it('should send the data to server successfully', fakeAsync(() => {
      // Arrange
      component.formGroup.patchValue(mockData);
      const registerSpy = spyOn(component, 'register').and.callThrough();
      userServiceSpy.create.and.returnValue(observableData(mockUser));

      // Act
      expect(component.status).toEqual('success');
      triggerClickEventOnElement(fixture, 'register-button', true);
      fixture.detectChanges();
      // expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();

      // Assert
      let textContent = 'The register method should be called';
      expect(registerSpy).withContext(textContent).toHaveBeenCalledTimes(1);

      textContent = 'The create method should be called';
      expect(userServiceSpy.create)
        .withContext(textContent)
        .toHaveBeenCalledOnceWith(mockData);

      textContent = 'The response should be handled and the status updated';
      expect(component.status).withContext(textContent).toEqual('success');
    }));

    it('should handle the error from server', fakeAsync(() => {
      // Arrange
      component.formGroup.patchValue(mockData);
      const buttonElement: HTMLButtonElement = query(
        fixture,
        'register-button',
        true
      ).nativeElement;
      const registerSpy = spyOn(component, 'register').and.callThrough();
      const error = new Error('Error');
      userServiceSpy.create.and.returnValue(observableError(error));

      // Act
      expect(component.status).toEqual('success');
      buttonElement.click();
      fixture.detectChanges();
      // expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();

      // Assert
      let textContent = 'The register method should be called';
      expect(buttonElement).toBeDefined();
      expect(registerSpy).withContext(textContent).toHaveBeenCalledTimes(1);

      textContent = 'The create method should be called';
      expect(userServiceSpy.create)
        .withContext(textContent)
        .toHaveBeenCalledOnceWith(mockData);

      textContent = 'The response should be handled and the status updated';
      expect(component.status).withContext(textContent).toEqual('error');
    }));

    it('should handle the error when the form is not valid', () => {
      // Arrange
      const registerSpy = spyOn(component, 'register').and.callThrough();

      // Act
      expect(component.status).toEqual('success');
      triggerClickEventOnElement(fixture, 'register-button', true);
      fixture.detectChanges();

      // Assert
      let textContent = 'The register method should be called';
      expect(registerSpy).withContext(textContent).toHaveBeenCalledTimes(1);

      textContent = 'The form should be invalid';
      expect(component.formGroup.status)
        .withContext(textContent)
        .toEqual('INVALID');
      textContent = 'The form should be touched';
      expect(component.formGroup.touched).withContext(textContent).toBeTruthy();
      Object.entries(component.formGroup.controls).forEach(([key, control]) => {
        textContent = `The control '${key}' should be dirty`;
        expect(control.dirty).withContext(textContent).toBeTruthy();
      });
    });

    it('should send the data to server successfully from UI', fakeAsync(() => {
      searchAndSetValueOnInputElement(fixture, 'input#name', mockData.name);
      searchAndSetValueOnInputElement(fixture, 'input#email', mockData.email);
      searchAndSetValueOnInputElement(
        fixture,
        'input#password',
        mockData.password
      );
      searchAndSetValueOnInputElement(
        fixture,
        'input#confirmPassword',
        mockData.confirmPassword
      );
      searchAndSetValueOnCheckboxElement(
        fixture,
        'input#terms',
        mockData.checkTerms
      );

      const registerSpy = spyOn(component, 'register').and.callThrough();
      userServiceSpy.create.and.returnValue(observableData(mockUser));

      // Act
      expect(component.status).toEqual('success');
      triggerClickEventOnElement(fixture, 'register-button', true);
      fixture.detectChanges();

      tick();
      fixture.detectChanges();

      // Assert
      let textContent = 'The register method should be called';
      expect(registerSpy).withContext(textContent).toHaveBeenCalledTimes(1);

      textContent = 'The create method should be called';
      expect(userServiceSpy.create)
        .withContext(textContent)
        .toHaveBeenCalledOnceWith(mockData);

      textContent = 'The response should be handled and the status updated';
      expect(component.status).withContext(textContent).toEqual('success');

      textContent = 'Should navigate to the login page';
      expect(routerSpy.navigateByUrl).withContext(textContent).toHaveBeenCalledOnceWith(
        '/auth/login'
      );
    }));
  });
});
