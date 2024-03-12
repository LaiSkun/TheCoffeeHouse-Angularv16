import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product/product.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productList: any[] = [];
  categoryList: any[] = [];

  page: number = 1;
  constructor(
    private route: ActivatedRoute ,
    private productService: ProductService
   ) { }

  ngOnInit() {
    this.loadCategory();
    this.route.paramMap.subscribe((params) => {
      const categoryid = params.get('categoryid');
      if (categoryid) {
        this.filterProductsByCategory(categoryid);
      } else {
        this.loadProducts();
      }
    });
  }

  //lấy tất cả sp
  loadProducts(){
    this.productService.getAllProducts().subscribe((products) => {
      this.productList = products;
    });
  }


  //lấy tất cả danh mục
  loadCategory(){
    this.productService.getAllCategories().subscribe((categories) => {
      this.categoryList = categories;
    });
  }

  //lọc sp dựa theo mã danh mục
  filterProductsByCategory(categoryId: string) {
    this.productService.filterProductsByCategory(categoryId).subscribe((filterProduct) => {
      this.productList = filterProduct;
    })
  }


}
