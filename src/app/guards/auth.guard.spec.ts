import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { generateOneUser } from '@models/mocks/user.mock';
import { AuthService } from '@services/auth.service';
import {
  fakeActivatedRouteSnapshot,
  fakeRouterStateSnapshot,
  observableData,
} from '@testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpyObj = jasmine.createSpyObj<AuthService>(
      'AuthService',
      [],
      {
        user$: observableData(generateOneUser()),
      }
    );
    const routerSpyObj = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: authServiceSpyObj,
        },
        {
          provide: Router,
          useValue: routerSpyObj,
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if user is logged in', waitForAsync(() => {
    const route = fakeActivatedRouteSnapshot({});
    const state = fakeRouterStateSnapshot({});

    guard.canActivate(route, state).subscribe({
      next: (value) => {
        expect(value).toBeTrue();
      },
    });
  }));

  it("should return false if user isn't logged in", waitForAsync(() => {
    const route = fakeActivatedRouteSnapshot({});
    const state = fakeRouterStateSnapshot({});
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    (
      Object.getOwnPropertyDescriptor(authServiceSpy, 'user$')?.get as any
    ).and?.returnValue(observableData(null));

    guard.canActivate(route, state).subscribe({
      next: (value) => {
        expect(value).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      },
    });
  }));
});
