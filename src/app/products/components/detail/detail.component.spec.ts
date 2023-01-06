import { Location } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { generateOneProduct } from '@models/mocks/product.mock';

import { ProductService } from '@services/product.service';
import {
  ActivatedRouteStub,
  getTextContentBySelector,
  asyncData,
  asyncError,
  query,
} from '@testing';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let activatedRouteStub: ActivatedRouteStub;
  let locationSpy: jasmine.SpyObj<Location>;

  let textContext: string;

  const product = generateOneProduct();
  const productId = product.id;

  beforeEach(async () => {
    const productServiceSpyObj = jasmine.createSpyObj('ProductService', [
      'getOne',
    ]);
    const activatedRouteStubValue = new ActivatedRouteStub();
    const locationSpyObj = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [RouterModule],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceSpyObj,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStubValue,
        },
        {
          provide: Location,
          useValue: locationSpyObj,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    // Get injected services
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    activatedRouteStub = TestBed.inject(
      ActivatedRoute
    ) as unknown as ActivatedRouteStub;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the product in the view', fakeAsync(() => {
    // Set up spies
    productServiceSpy.getOne.and.returnValue(asyncData(product));
    activatedRouteStub.setParamMap({ id: productId });

    expect(component.status).toBeNull();
    fixture.detectChanges();
    expect(component.status).toBe('loading');
    expect(component.product).toBeNull();

    tick();
    fixture.detectChanges();

    const productTitle = getTextContentBySelector(
      fixture,
      'product-title',
      true
    );
    const productImage = query(fixture, 'product-image', true).nativeElement
      .src;
    const productPrice = getTextContentBySelector(
      fixture,
      'product-price',
      true
    );

    textContext = 'should have called the service to get the product';
    expect(productServiceSpy.getOne)
      .withContext(textContext)
      .toHaveBeenCalledWith(productId);
    expect(component.status).toBe('loaded');

    expect(productTitle).toContain(product.title);
    expect(productImage).toBe(product.images[0]);
    expect(productPrice).toContain(product.price.toString());
  }));

  it('should go back to the previous page when the param is invalid', () => {
    // Arrange
    spyOn(component, 'goToBack').and.callThrough();
    activatedRouteStub.setParamMap({});
    locationSpy.back.and.callThrough();

    // Act
    expect(component.status).toBeNull();
    fixture.detectChanges();
    expect(component.status).toBeNull();

    // Assert
    expect(component.goToBack).toHaveBeenCalled();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should go back to the previous page when the product is not found', fakeAsync(() => {
    // Set up spies
    productServiceSpy.getOne.and.returnValue(
      asyncError(new Error('Product not found'))
    );
    spyOn(component, 'goToBack').and.callThrough();
    locationSpy.back.and.callThrough();

    activatedRouteStub.setParamMap({ id: productId });

    expect(component.status).toBeNull();
    // Trigger ngOnInit
    fixture.detectChanges();

    expect(component.status).toBe('loading');
    expect(component.product).toBeNull();

    tick();

    expect(component.status).toBe('error');

    textContext = 'should have called the service to get the product';
    expect(productServiceSpy.getOne)
      .withContext(textContext)
      .toHaveBeenCalledWith(productId);
    expect(component.goToBack).toHaveBeenCalled();
    expect(locationSpy.back).toHaveBeenCalled();
  }));

  it('should typeCustomer be \'null\'', () => {
    // Set up spies
    productServiceSpy.getOne.and.returnValue(asyncData(product));
    activatedRouteStub.setParamMap({ id: productId });
    activatedRouteStub.setQueryParamMap({ });

    fixture.detectChanges();

    expect(component.typeCustomer).toBeNull();
  });

  it('should typeCustomer be \'standard\'', () => {
    // Set up spies
    productServiceSpy.getOne.and.returnValue(asyncData(product));
    activatedRouteStub.setParamMap({ id: productId });
    activatedRouteStub.setQueryParamMap({ type: 'standard' });

    fixture.detectChanges();

    expect(component.typeCustomer).toBe('standard');
  });

  it('should typeCustomer be \'premium\'', () => {
    // Set up spies
    productServiceSpy.getOne.and.returnValue(asyncData(product));
    activatedRouteStub.setParamMap({ id: productId });
    activatedRouteStub.setQueryParamMap({ type: 'premium' });

    fixture.detectChanges();

    expect(component.typeCustomer).toBe('premium');
  });
});
