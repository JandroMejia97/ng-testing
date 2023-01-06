import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { generateOneProduct } from '@models/mocks/product.mock';

import { ProductService } from '@services/product.service';
import { ActivatedRouteStub, getTextContentBySelector, observableData, query } from '@testing';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let activatedRouteStub: ActivatedRouteStub;
  let locationSpy: jasmine.SpyObj<Location>;

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
        }
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

  it('should show the product in the view', () => {
    // Set up spies
    productServiceSpy.getOne.and.returnValue(
      observableData(product)
    );
    activatedRouteStub.setParamMap({ id: productId });

    fixture.detectChanges();

    const productTitle = getTextContentBySelector(fixture, 'product-title', true);
    const productImage = query(fixture, 'product-image', true).nativeElement.src;
    const productPrice = getTextContentBySelector(fixture, 'product-price', true);

    expect(component).toBeTruthy();
    expect(productServiceSpy.getOne).toHaveBeenCalledWith(productId);

    expect(productTitle).toContain(product.title);
    expect(productImage).toBe(product.images[0]);
    expect(productPrice).toContain(product.price.toString());
  });
});
