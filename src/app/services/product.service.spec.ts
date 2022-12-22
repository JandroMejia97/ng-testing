import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '@models/product.model';
import { environment } from '@environments/environment';
import { generateManyProducts, generateOneProduct } from '@models/mocks/product.mock';

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
      const mockProducts: Product[] = generateManyProducts(3);

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

  describe('Tests for getAll', () => {
    it('should return an array of products', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = generateManyProducts(3);

      // Act
      productService.getAll().subscribe({
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

    it('should return an array of products with taxes', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * 0.19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * 0.19 = 38
        }
      ];

      // Act
      productService.getAll().subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
          expect(products[0].taxes).toBe(19);
          expect(products[1].taxes).toBe(38);
        }
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
      httpController.verify();
    }));

    it('should return 0 taxes for a product with a invalid price (zero or negative)', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = [
        {
          ...generateOneProduct(),
          price: 0, // 0 * 0.19 = 0
        },
        {
          ...generateOneProduct(),
          price: -200, // -200 * 0.19 = 0
        }
      ];

      // Act
      productService.getAll().subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
          expect(products[0].taxes).toBe(0);
          expect(products[1].taxes).toBe(0);

        }
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
      httpController.verify();
    }));

    it('should send a request to the API with the correct query params', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = generateManyProducts(3);
      const limit = 10, offset = 20;

      // Act
      productService.getAll(limit, offset).subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        }
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products?limit=${limit}&offset=${offset}`);
      request.flush(mockProducts);

      const { params } = request.request;
      expect(params.get('limit')).toBe(limit.toString());
      expect(params.get('offset')).toBe(offset.toString());
      httpController.verify();
    }));

    it('should ignore an `undefined` offset as query param in the request', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = generateManyProducts(3);
      const limit = 10, offset = undefined;

      // Act
      productService.getAll(limit, offset).subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        }
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);

      const { params } = request.request;
      expect(params.get('limit')).toBeNull();
      expect(params.get('offset')).toBeNull();
      httpController.verify();
    }));

    it('should ignore an invalid limit as query param in the request', waitForAsync(() => {
      // Arrange
      const mockProducts: Product[] = generateManyProducts(3);
      const limit = -1, offset = 0;

      // Act
      productService.getAll(limit, offset).subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        }
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);

      const { params } = request.request;
      expect(params.get('limit')).toBeNull();
      expect(params.get('offset')).toBeNull();
      httpController.verify();
    }));
  });
});
