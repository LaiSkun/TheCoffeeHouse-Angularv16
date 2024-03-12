import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/service/cart/cart.service';
import { ProductService } from 'src/app/service/product/product.service';
import { ToppingService } from '../../service/topping/topping.service';
import { SizeService } from '../../service/size/size.service';
import {formatCurrency} from "src/app/share-module/formatCurrency.pipe";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product:any;
  size:any;
  topping:any;

  productList: any[] = [];
  toppingList: any[] = [];
  sizeList: any[] = [];
  selectedSize: any[] = [];
  selectedToppings: any[] = [];

  selectedSizePrice: number = 0;
  selectedToppingPrice: number = 0;


  constructor(private route:ActivatedRoute,
    private productService: ProductService,
    private cartService :CartService ,
    private toppingService:ToppingService,
    private sizeService:SizeService,

    ) { }


  ngOnInit() {
    this.loadProducts();
    this.loadAllSize();
  }
  loadProducts(){
    this.productService.getAllProducts().subscribe((products) => {
      this.productList = products;
      let id = this.route.snapshot.params['id'];
      this.product = products.find(p=>p.productid === id);
      this.loadTopping(this.product.productid);
    });
  }
  loadTopping(productid: string){
    this.toppingService.getToppingByProductID(productid).subscribe((toppingData)=>{
      this.toppingList = toppingData;
    })

  }

  loadAllSize(){
    this.sizeService.getAllSize().subscribe((size) => {
      this.sizeList = size;
    })
  }
  //thêm sp vào giỏ hàng
  addToCart(product: any,size: any, topping: any) {
    // Tạo một bản sao của mảng selectedToppings
    const selectedToppingsCopy = [...this.selectedToppings];

    this.cartService.addtoCart(product,1,size,selectedToppingsCopy);

    this.selectedToppings = [];

    this.selectedSizePrice = 0 ;

    this.selectedToppingPrice = 0;

  }

  toggleTopping(topping: any) {
    const index = this.selectedToppings.findIndex((t) => t.toppingid === topping.toppingid);
    if (index !== -1) {
      this.selectedToppings.splice(index, 1);
    } else {
      this.selectedToppings.push(topping);
    }
    // Cập nhật giá tiền của các topping được chọn
  this.selectedToppingPrice = this.calculateToppingsPrice(this.selectedToppings);
  }

  calculateToppingsPrice(toppings:any[]):number{
    return toppings.reduce((total, topping) => total + topping.toppingprice, 0);
  }

  isToppingSelected(topping: any): boolean {
    return this.selectedToppings.some((t) => t.toppingid === topping.toppingid);
  }

  selectSize(sizeitem: any) {
    this.selectedSize = sizeitem;
    this.selectedSizePrice = sizeitem.price;
  }
}
