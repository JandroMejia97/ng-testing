import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '@services/product.service';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const productServiceSpyObj = jasmine.createSpyObj('ProductService', [
      'getOne',
    ]);
    const activatedRouteSpyObj = jasmine.createSpyObj('ActivatedRoute', [], {
      paramMap: jasmine.createSpyObj('paramMap', ['subscribe']),
    });
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
          useValue: activatedRouteSpyObj,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    activatedRouteSpy = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
