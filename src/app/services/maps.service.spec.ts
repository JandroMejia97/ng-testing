import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService],
    });
    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a center property', () => {
    expect(service.center).toBeDefined();
  });

  describe('Tests for getCurrentLocation', () => {
    it('should set the center property', () => {
      const mockCoords = { latitude: 1000, longitude: 1000 };
      // Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (success) => {
          const mockPosition: GeolocationPosition = {
            coords: {
              ...mockCoords,
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              speed: 0,
            },
            timestamp: 0,
          };
          success(mockPosition);
        }
      );

      // Act
      service.getCurrentLocation();

      // Assert
      expect(service.center).toEqual(mockCoords);
    });

    it('should handle errors', () => {
      spyOn(console, 'log').and.callThrough();
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((_, error: PositionErrorCallback) => {
        expect(error).toBeDefined();
        error({ code: 0, message: 'Error', PERMISSION_DENIED: 0, POSITION_UNAVAILABLE: 0, TIMEOUT: 0 });
      });

      service.getCurrentLocation();
    });
  });

});
