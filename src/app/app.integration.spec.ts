import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  query,
  queryAllByDirective,
  triggerClickEventOnElement,
} from '@testing';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

fdescribe('AppIntegration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
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

  it('should render OthersComponent', fakeAsync(() => {
    triggerClickEventOnElement(fixture, 'others-link', true);

    tick();
    fixture.detectChanges();
    const othersComponent = query(fixture, 'app-others');

    expect(othersComponent).toBeDefined();
    expect(router.url).toBe('/others');
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
