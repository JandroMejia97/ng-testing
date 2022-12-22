import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '@models/product.model';
import { environment } from '@environments/environment';
import {
  generateManyProducts,
  generateOneProduct,
} from '@models/mocks/product.mock';

fdescribe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/v1`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
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
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
    }));
  });

  describe('Tests for getAll', () => {
    let mockProducts: Product[];
    const limit = 10;

    beforeEach(() => {
      // Arrange
      mockProducts = generateManyProducts(3);
    });

    it('should return an array of products', waitForAsync(() => {
      // Act
      productService.getAll().subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
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
        },
      ];

      // Act
      productService.getAll().subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
          expect(products[0].taxes).toBe(19);
          expect(products[1].taxes).toBe(38);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
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
        },
      ];

      // Act
      productService.getAll().subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
          expect(products[0].taxes).toBe(0);
          expect(products[1].taxes).toBe(0);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);
    }));

    it('should send a request to the API with the correct query params', waitForAsync(() => {
      const offset = 20;

      // Act
      productService.getAll(limit, offset).subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(
        `${apiUrl}/products?limit=${limit}&offset=${offset}`
      );
      request.flush(mockProducts);

      const { params } = request.request;
      expect(params.get('limit')).toBe(limit.toString());
      expect(params.get('offset')).toBe(offset.toString());
    }));

    it('should ignore an `undefined` offset as query param in the request', waitForAsync(() => {
      // Arrange
      const offset = undefined;

      // Act
      productService.getAll(limit, offset).subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);

      const { params } = request.request;
      expect(params.get('limit')).toBeNull();
      expect(params.get('offset')).toBeNull();
    }));

    it('should ignore an invalid limit as query param in the request', waitForAsync(() => {
      // Arrange
      const limit = -1;
      const offset = 0;

      // Act
      productService.getAll(limit, offset).subscribe({
        next: (products) => {
          // Assert
          expect(products.length).toBe(mockProducts.length);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProducts);

      const { params } = request.request;
      expect(params.get('limit')).toBeNull();
      expect(params.get('offset')).toBeNull();
    }));
  });

  describe('Tests for create', () => {
    let product: CreateProductDTO;
    let mockProduct: Product;

    beforeEach(() => {
      // Arrange
      mockProduct = generateOneProduct();
      product = {
        title: 'Test',
        description: 'Test',
        price: 100,
        images: ['test image'],
        categoryId: 1,
      };
    });

    it('should return a new product', waitForAsync(() => {
      // Act
      productService.create({ ...product }).subscribe({
        next: (product) => {
          // Assert
          expect(product).toEqual(mockProduct);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(`${apiUrl}/products`);
      request.flush(mockProduct);
      expect(request.request.method).toBe('POST');
    }));

    it('should send a request to the API with the correct body', waitForAsync(() => {
      // Act
      productService.create({ ...product }).subscribe({
        next: (product) => {
          // Assert
          expect(product).toEqual(mockProduct);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne({
        url: `${apiUrl}/products`,
        method: 'POST',
      });
      request.flush(mockProduct);
      expect(request.request.body).toEqual(product);
      expect(request.request.method).toBe('POST');
    }));
  });

  describe('Tests for delete', () => {
    it('should return a void', waitForAsync(() => {
      // Arrange
      const productId = '1';
      // Act
      productService.delete(productId).subscribe({
        next: (response) => {
          // Assert
          expect(response).toBeUndefined();
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(
        `${apiUrl}/products/${productId}`
      );
      expect(request.request.method).toBe('DELETE');
    }));
  });

  describe('Tests for update', () => {
    it('should update a product', waitForAsync(() => {
      // Arrange
      const mockProduct = generateOneProduct();
      const productId = '1';
      const product: UpdateProductDTO = {
        title: 'Test',
      };

      // Act
      productService.update(productId, {...product}).subscribe({
        next: (product) => {
          // Assert
          expect(product).toEqual(mockProduct);
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const request = httpController.expectOne(
        `${apiUrl}/products/${productId}`
      );
      request.flush(mockProduct);

      // Assert
      expect(request.request.method).toBe('PUT');
      expect(request.request.body).toEqual(product);
    }));

  });

  describe('Tests for fetchReadAndUpdate', () => {
    // Arrange
    let mockProduct: Product;
    let productId: string;
    let product: UpdateProductDTO;

    beforeAll(() => {
      mockProduct = generateOneProduct();
      productId = '1';
      product = {
        title: 'Test',
      };
    });

    it('should update and read a product', waitForAsync(() => {
      // Act
      productService.fetchReadAndUpdate(productId, {...product}).subscribe({
        next: ([getProduct, updatedProduct]) => {
          // Assert
          expect(getProduct).toEqual(mockProduct);
          expect(updatedProduct).toEqual({
            ...mockProduct,
            ...product,
          });
        },
      });

      // HttpClientTestingModule will intercept the request and return the mockProducts
      const getRequest = httpController.expectOne({
        url: `${apiUrl}/products/${productId}`,
        method: 'GET',
      });
      getRequest.flush(mockProduct);

      const putRequest = httpController.expectOne({
        url: `${apiUrl}/products/${productId}`,
        method: 'PUT',
      });
      putRequest.flush({
        ...mockProduct,
        ...product,
      });

      // Assert
      expect(getRequest.request.method).toBe('GET');

      expect(putRequest.request.method).toBe('PUT');
      expect(putRequest.request.body).toEqual(product);
    }));

  });
});
