import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { environment } from '@environments/environment';
import { Auth } from '@models/auth.model';
import { User } from '@models/user.model';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;
  const apiUrl = `${environment.apiUrl}/api/v1/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenService]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('Tests for login', () => {
    const email = 'admin@localhost';
    const password = 'password';

    it('should call the login endpoint and return a token', waitForAsync(() => {
      const mockToken: Auth = {
        access_token: 'token',
      };
      spyOn(tokenService, 'saveToken').and.callThrough();

      authService.login(email, password).subscribe({
        next: (response) => {
          expect(response).toEqual(mockToken);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledWith(mockToken.access_token);
        }
      });

      const req = httpController.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toEqual('POST');
      req.flush(mockToken);
    }));
  });

  describe('Tests for getProfile', () => {
    it('should call the profile endpoint and return a user', waitForAsync(() => {
      const mockUser: User = {
        id: '1',
        name: 'Admin',
        email: 'admin@localhost',
        password: 'password',
      };

      authService.getProfile().subscribe({
        next: (response) => {
          expect(response).toEqual(mockUser);
        }
      });

      const req = httpController.expectOne(`${apiUrl}/profile`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockUser);

    }));
  });

  describe('Tests for loginAndGet', () => {
    const email = 'admin@localhost';
    const password = 'password';

    it('should call the login endpoint and return a user', waitForAsync(() => {
      const mockToken: Auth = {
        access_token: 'token',
      };
      const mockUser: User = {
        id: '1',
        name: 'Admin',
        email: 'admin@localhost',
        password: 'password',
      };

      spyOn(tokenService, 'saveToken').and.callThrough();

      authService.loginAndGet(email, password).subscribe({
        next: (response) => {
          expect(response).toEqual(mockUser);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledWith(mockToken.access_token);
        }
      });

      const loginRequest = httpController.expectOne({
        url: `${apiUrl}/login`,
        method: 'POST'
      });
      expect(loginRequest.request.method).toEqual('POST');
      loginRequest.flush(mockToken);

      const profileRequest = httpController.expectOne({
        url: `${apiUrl}/profile`,
        method: 'GET'
      });
      expect(profileRequest.request.method).toEqual('GET');
      profileRequest.flush(mockUser);

    }));
  });
});
