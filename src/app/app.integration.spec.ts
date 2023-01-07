import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import {
  observableData,
  query,
  queryAllByDirective,
  triggerClickEventOnElement,
} from '@testing';
import { AuthService } from '@services/auth.service';
import { generateOneUser } from '@models/mocks/user.mock';
import { OthersComponent } from '@components/others/others.component';

import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

describe('AppIntegration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj<AuthService>(
      'AuthService',
      [],
      {
        user$: observableData(generateOneUser()),
      }
    );

    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: AuthService, useValue: authServiceSpyObj }],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router.initialNavigation();

    tick();
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have router-outlet', () => {
    const routerOutlet = query(fixture, 'router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have 6 links', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);

    expect(links.length).toBe(6);
  });

  it('should render OthersComponent when user is authenticated', fakeAsync(() => {
    triggerClickEventOnElement(fixture, 'others-link', true);

    tick();
    fixture.detectChanges();
    const othersComponent = query(fixture, 'app-others');

    expect(othersComponent).toBeDefined();
    expect(router.url).toBe('/others');
  }));

  it('should redirect to /home when user is not authenticated', fakeAsync(() => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, 'user$')?.get as any
    ).and?.returnValue(observableData(null));
    const authGuard = TestBed.inject(AuthGuard);
    const authGuardSpy = spyOn(authGuard, 'canActivate').and.callThrough();

    triggerClickEventOnElement(fixture, 'others-link', true);

    tick();
    fixture.detectChanges();

    const othersComponent = fixture.debugElement.query(By.directive(OthersComponent));

    expect(router.url).toBe('/');
    expect(authGuardSpy).toHaveBeenCalled();
    expect(othersComponent).toBeNull();
  }));

  it('should render PeopleComponent', fakeAsync(() => {
    triggerClickEventOnElement(fixture, 'people-link', true);

    tick();
    fixture.detectChanges();
    const peopleComponent = query(fixture, 'app-people');

    expect(peopleComponent).toBeDefined();
    expect(router.url).toBe('/people');
  }));

  it('should render PicoPreviewComponent', fakeAsync(() => {
    triggerClickEventOnElement(fixture, 'pico-preview-link', true);

    tick();
    fixture.detectChanges();
    const picoPreviewComponent = query(fixture, 'app-pico-preview');

    expect(picoPreviewComponent).toBeDefined();
    expect(router.url).toBe('/pico-preview');
  }));
});
