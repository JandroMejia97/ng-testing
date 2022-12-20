import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { Product, CreateProductDTO, UpdateProductDTO } from '@models/product.model';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getByCategory(categoryId: string, limit?: number, offset?: number){
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.httpClient.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, { params })
  }

  getAllSimple() {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`);
  }

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`, { params })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(
      this.getOne(id),
      this.update(id, dto)
    );
  }

  getOne(id: string) {
    return this.httpClient.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ups algo salio mal';
        if (error.status === HttpStatusCode.Conflict) {
          errorMessage = 'Algo esta fallando en el servidor.'
        }
        if (error.status === HttpStatusCode.NotFound) {
          errorMessage = 'El producto no existe';
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          errorMessage = 'No tiene permitido el acceso';
        }
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  create(dto: CreateProductDTO) {
    return this.httpClient.post<Product>(`${this.apiUrl}/products`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.httpClient.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
