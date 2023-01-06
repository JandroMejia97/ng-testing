import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { generateOneProduct } from '@models/mocks/product.mock';

import { ProductService } from '@services/product.service';
import { ActivatedRouteStub, observableData } from '@testing';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let activatedRouteSpy: ActivatedRouteStub;
  let locationSpy: jasmine.SpyObj<Location>;

  const product = generateOneProduct();
  const productId = product.id;

  beforeEach(async () => {
    const productServiceSpyObj = jasmine.createSpyObj('ProductService', [
      'getOne',
    ]);
    const activatedRouteStub = new ActivatedRouteStub();
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
          useValue: activatedRouteStub,
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
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as unknown as ActivatedRouteStub;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    // Set up spies
    productServiceSpy.getOne.and.returnValue(
      observableData(product)
    );
    activatedRouteSpy.setParamMap({ id: productId });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
