import { Component, OnInit } from '@angular/core';
import { Product } from '@models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  status: 'loading' | 'error' | 'success' = 'success';
  private limit = 10;
  private offset = 0;

  constructor(private productService: ProductService) {}

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
}
