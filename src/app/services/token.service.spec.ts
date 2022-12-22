import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  const token = '1234567890';
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token', () => {
    spyOn(service, 'saveToken').and.callThrough();

    service.saveToken(token);
    expect(service.saveToken).toHaveBeenCalledWith(token);
  });

  it('should return null if no token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should return token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(token);

    expect(service.getToken()).toEqual(token);
    expect(localStorage.getItem).toHaveBeenCalled();
  });
});
