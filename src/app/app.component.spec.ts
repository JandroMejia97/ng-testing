import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  queryAllByDirective,
  RouterLinkDirectiveStub,
} from '@testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, RouterLinkDirectiveStub],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have 6 routerLinks`, () => {
    const routerLinks = queryAllByDirective(fixture, RouterLinkDirectiveStub);

    fixture.detectChanges();

    expect(routerLinks.length).withContext('should have 6 routerLinks').toBe(6);
  });

  it(`should there match all routerLinks with routes`, () => {
    fixture.detectChanges();

    const routerLinks = queryAllByDirective(fixture, RouterLinkDirectiveStub);

    const routes = routerLinks.map(
      (link) => link.injector.get(RouterLinkDirectiveStub).linkParams
    );
    const expectedRoutes = [
      '/',
      '/auth/register',
      '/products',
      '/pico-preview',
      '/people',
      '/others',
    ];

    expect(routes).toEqual(expectedRoutes);
  });
});
