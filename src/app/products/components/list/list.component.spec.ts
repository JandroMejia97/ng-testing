import { HttpErrorResponse } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProductComponent } from '@products/components/product/product.component';
import { generateManyProducts } from '@models/mocks/product.mock';
import { Product } from '@models/product.model';
import { ValueService } from '@services/value.service';
import { ProductService } from '@services/product.service';
import {
  asyncData,
  asyncError,
  getTextContentBySelector,
  observableData,
  observableError,
  query
} from '@testing';

import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

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
      declarations: [ListComponent, ProductComponent],
      imports: [RouterTestingModule],
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
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    const productsMock = generateManyProducts(5);
    productServiceSpy.getAll.and.returnValue(observableData(productsMock));

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
      productServiceSpy.getAll.and.returnValue(observableData(productsMock));

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
      productServiceSpy.getAll.and.returnValue(observableData(productsMock));
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
      spyOn(component, 'getProducts').and.callThrough();
      productServiceSpy.getAll.and.returnValue(observableError(errorMock));
      component.products = [];
      const debugButton = query(fixture, 'button[name="loadMore"]');

      // Act
      debugButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      // Assert
      expect(component.getProducts).toHaveBeenCalledTimes(1);
      expect(component.products).toEqual([]);
    });

    it('should change the status property from "loading" to "success" when the getAll method from ProductService return an array of products', fakeAsync(() => {
      // Arrange
      const productsMock = generateManyProducts(5);
      productServiceSpy.getAll.and.returnValue(asyncData(productsMock));
      spyOn(component, 'getProducts').and.callThrough();
      const debugButton = query(fixture, 'button[name="loadMore"]');

      // Act
      debugButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();
      // Assert
      expect(component.getProducts).toHaveBeenCalledTimes(1);
      expect(component.status).toEqual('success');
    }));

    it('should change the status property from "loading" to "error" when the getAll method from ProductService return an error', fakeAsync(() => {
      // Arrange
      const errorMock = new HttpErrorResponse({ status: 404 });
      productServiceSpy.getAll.and.returnValue(asyncError(errorMock));
      spyOn(component, 'getProducts').and.callThrough();
      const debugButton = query(fixture, 'button[name="loadMore"]');

      // Act
      debugButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.status).toEqual('loading');

      tick();
      fixture.detectChanges();
      // Assert
      expect(component.getProducts).toHaveBeenCalledTimes(1);
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

    it('should show "Example" when user click a button to call a Promise', fakeAsync(() => {
      // Arrange
      spyOn(component, 'callPromise').and.callThrough();
      const debugButton = query(fixture, 'button[name="callPromise"]');

      // Act
      debugButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const responseParagraph = getTextContentBySelector(fixture, 'p.response');

      // Assert
      expect(component.callPromise).toHaveBeenCalled();
      expect(component.response).toEqual('Example');
      expect(responseParagraph).toContain('Example');
    }));
  });
});
