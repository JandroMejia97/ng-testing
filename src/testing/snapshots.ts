import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export function fakeRouterStateSnapshot(options: Partial<RouterStateSnapshot>): RouterStateSnapshot {
  return options as RouterStateSnapshot;
}

export function fakeActivatedRouteSnapshot(options: Partial<ActivatedRouteSnapshot>): ActivatedRouteSnapshot {
  return options as ActivatedRouteSnapshot;
}
