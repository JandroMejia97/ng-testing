import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { defer, of, throwError } from 'rxjs';

import { ProductComponent } from '@components/product/product.component';
import { generateManyProducts } from '@models/mocks/product.mock';
import { Product } from '@models/product.model';
import { ValueService } from '@services/value.service';
import { ProductService } from '@services/product.service';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['getAll']
    );

    const valueServiceSpy = jasmine.createSpyObj<ValueService>(
      'ValueService',
      [],
      {
        value: 'Example',
        promiseValue: Promise.resolve('Example'),
      }
    );

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceSpy,
        },
        {
          provide: ValueService,
          useValue: valueServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
    const productsMock = generateManyProducts(5);
    productServiceSpy.getAll.and.returnValue(of(productsMock));

    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productServiceSpy.getAll).toHaveBeenCalled();
  });

  describe('Tests for getProducts method', () => {
    it('should call getAll method from ProductService', () => {
      // Arrange
      const productsMock = generateManyProducts(5);
      productServiceSpy.getAll.and.returnValue(of(productsMock));

      // Act
      component.getProducts();
      fixture.detectChanges();

      // Assert
      expect(productServiceSpy.getAll).toHaveBeenCalled();
      expect(component.products.length).toBeGreaterThan(0);
    });

    it('should set products property with an empty array when the getAll method from ProductService return an empty array', () => {
      // Arrange
      const productsMock: Product[] = [];
      productServiceSpy.getAll.and.returnValue(of(productsMock));
      component.products = [];

      // Act
      component.getProducts();
      fixture.detectChanges();

      // Assert
      expect(component.products).toEqual(productsMock);
    });

    it('should set products property with an empty array when the getAll method from ProductService return an error', () => {
      // Arrange
      const errorMock = new HttpErrorResponse({ status: 404 });
      productServiceSpy.getAll.and.returnValue(throwError(() => errorMock));
      component.products = [];

      // Act
      component.getProducts();

      // Assert
      expect(component.products).toEqual([]);
    });

    it('should change the status property from "loading" to "success" when the getAll method from ProductService return an array of products', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(5);
      productServiceSpy.getAll.and.returnValue(
        defer(() => Promise.resolve(productsMock))
      );

      // Act
      component.getProducts();
      fixture.detectChanges();
      expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('success');
    }));

    it('should change the status property from "loading" to "error" when the getAll method from ProductService return an error', fakeAsync(() => {
      // Arrange
      const errorMock = new HttpErrorResponse({ status: 404 });
      productServiceSpy.getAll.and.returnValue(
        defer(() => Promise.reject(errorMock))
      );

      // Act
      component.getProducts();
      fixture.detectChanges();
      expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('error');
    }));
  });

  describe('Tests for callPromise', () => {
    it('should call promiseValue method from ValueService', async () => {
      // Act
      await component.callPromise();
      fixture.detectChanges();

      // Assert
      expect(component.response).toEqual('Example');
    });
  });
});
