import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '@models/product.model';
import { ProductService } from '@services/product.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  product: Product | null = null;
  status: 'loading' | 'loaded' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.getProductDetail(productId);
      } else {
        this.goToBack();
      }
    });
  }

  private getProductDetail(productId: string) {
    this.status = 'loading';
    this.productService.getOne(productId).subscribe({
      next: (product) => {
        this.status = 'loaded';
        this.product = product;
      },
      error: () => {
        this.status = 'error';
        this.goToBack();
      },
    });
  }

  goToBack() {
    this.location.back();
  }
}
