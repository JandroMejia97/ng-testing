import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '@models/product.model';
import { environment } from '@environments/environment';

fdescribe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/v1`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return an array of products', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = [
        {
          id: '1',
          title: 'Test 1',
          price: 100,
          description: 'Test 1',
          category: {
            id: 1,
            name: 'Test 1'
          },
          images: [
            'https://test1.com',
            'https://test2.com'
          ]
        },
      ];

      // Act
      productService.getAllSimple().subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        }
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
      httpController.verify();
    }));
  });
});
