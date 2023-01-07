import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { generateManyProducts } from '@models/mocks/product.mock';

import { ProductService } from '@services/product.service';
import {
  asyncData,
  queryAllByDirective,
  queryByDirective,
  triggerClickEventOnElement,
} from '@testing';
import { DetailComponent } from './components/detail/detail.component';
import { ProductComponent } from './components/product/product.component';

import { routes } from './products-routing.module';
import { ProductsModule } from './products.module';
import { ProductsComponent } from './products.component';

describe('ProductsIntegration', () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let component: ProductsComponent;
  let router: Router;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let contextMessage: string;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getAll',
      'getOne',
    ]);
    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ProductsModule, RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: ProductService, useValue: productServiceSpy }],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;

    router.initialNavigation();
    tick();
  }));

  it('should create the app', fakeAsync(() => {
    productServiceSpy.getAll.and.returnValue(asyncData([]));
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should navigate to product detail', fakeAsync(() => {
    const products = generateManyProducts(10);
    const product = products[0];

    productServiceSpy.getAll.and.returnValue(asyncData(products));
    productServiceSpy.getOne.and.returnValue(asyncData(product));
    // Wait for navigation to complete
    tick();
    // ngOnInit
    fixture.detectChanges();
    // Wait for async getAll to complete
    tick();
    // Update view
    fixture.detectChanges();

    const productsRendered = queryAllByDirective(fixture, ProductComponent);
    contextMessage = 'ProductsComponent should render all products';
    expect(productsRendered.length)
      .withContext(contextMessage)
      .toBe(products.length);

    // Click on the first product
    triggerClickEventOnElement(fixture, 'see-more-link', true);
    // Wait for navigation to complete
    tick();
    // Update view
    fixture.detectChanges();
    // Wait for async getOne to complete
    tick();
    // Update view
    fixture.detectChanges();

    contextMessage = 'ProductService should be called with correct id';
    expect(productServiceSpy.getOne)
      .withContext(contextMessage)
      .toHaveBeenCalledWith(product.id);

    contextMessage = 'ProductService should be called only once';
    expect(productServiceSpy.getOne)
      .withContext(contextMessage)
      .toHaveBeenCalledTimes(1);

    contextMessage = 'Router should navigate to product detail';
    expect(router.url).toBe(`/${product.id}`);

    contextMessage = 'ProductDetailComponent should be rendered';
    expect(queryByDirective(fixture, DetailComponent))
      .withContext(contextMessage)
      .toBeDefined();
  }));
});
