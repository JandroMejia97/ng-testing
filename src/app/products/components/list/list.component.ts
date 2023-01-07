import { Component, OnInit } from '@angular/core';
import { Product } from '@models/product.model';
import { ValueService } from '@services/value.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  status: 'loading' | 'error' | 'success' = 'success';
  response = '';
  private limit = 10;
  private offset = 0;

  constructor(
    private valueService: ValueService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.status = 'loading';
    this.productService.getAll(this.limit, this.offset).subscribe({
      next: (products) => {
        this.products = [...this.products, ...products];
        this.offset += this.limit;
        this.status = 'success';
      },
      error: (err) => {
        this.status = 'error';
      },
    });
  }

 async callPromise() {
  const value = await this.valueService.promiseValue;
  this.response = value;
 }
}
