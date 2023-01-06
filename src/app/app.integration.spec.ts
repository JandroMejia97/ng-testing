import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
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
  queryByDirective,
  triggerClickEventOnElement,
} from '@testing';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-banner',
})
class BannerStubComponent {}

@Component({
  selector: 'app-footer',
})
class FooterStubComponent {}

@Component({
  selector: 'app-others',
})
class OthersStubComponent {}

const routes = [
  {
    path: 'others',
    component: OthersStubComponent,
  }
]

fdescribe('AppIntegration', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BannerStubComponent,
        FooterStubComponent,
        OthersStubComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule.withRoutes(routes)],
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
    const othersComponent = queryByDirective(fixture, OthersStubComponent);

    expect(othersComponent).toBeDefined();
    expect(router.url).toBe('/others');
  }));
});
