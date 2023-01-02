import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  center = { latitude: 0, longitude: 0 };

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        this.center = { latitude, longitude };
      }, () => {
        // Do something with the error
      });
    }
  }
}
