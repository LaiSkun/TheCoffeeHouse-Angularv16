import { ProductDTO } from './../../common/ProductDTO';
import { Component, OnInit } from '@angular/core';
import { OrderDTO } from 'src/app/common/OrderDTO';
import { HeaderFooterService } from 'src/app/service/show/header-footer.service';
import { OrderService } from '../../service/order/order.service';
import { OrderDetailDTO } from 'src/app/common/OrderDetailDTO';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart/cart.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  order: OrderDTO = {
    address: '',
    email: '',
    phone: '',
    totalPrice: 0,
    username: '',
    orderDetails: []
  };


  ngOnInit(): void {
    this.getFromSession();
    this.headerService.setShowHeaderFooter(false);

}
constructor(private headerService: HeaderFooterService, private orderService:OrderService, private cartService: CartService, private router: Router, private cookieService: CookieService) {

}
  cartItems : any[] = []

  checkout(): void {
    this.order.totalPrice = this.calculateTotalPrice();
    this.order.orderDetails = this.cartItems.map(x => {
      return {
        price: (x.product.price + x.size.price) * x.quantity +  this.getToppingPrice(x.topping),
        quantity: x.quantity,
        product: x.product,
        size: x.size.sizeid,
        toppingname: this.getToppingNames(x.topping)
      }
    });

    this.orderService.checkout(this.order).subscribe(
      (response) => {
          console.log('Payment successful:', response);
      },
      (response) => {
        console.error('Error during payment:', response);
        console.log(response)
        console.log('Error Response:', response.error);
        // Xử lý lỗi nếu có
      }
    );
    alert('Thanh toán thành công');
    this.cartService.clearAllCartItems()
    this.router.navigate(['']);
  }

  getToppingNames(toppings: any[]): string {
    return toppings.map(topping => topping.toppingname).join(', ');
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.cartItems.forEach(item => {
      totalPrice += (item.product.price + item.size.price) * item.quantity + this.getToppingPrice(item.topping) ;
    })
    return totalPrice;
  }

  getToppingPrice(toppings: any[]): number {
    return toppings.reduce((totalPrice,topping) => totalPrice + topping.toppingprice,0);
  }
  // Đặt lại trạng thái của header khi rời khỏi component
  ngOnDestroy(): void {
    this.headerService.setShowHeaderFooter(true);
  }

  private getFromSession() {
    const sessionKey = 'cartItems';
    const storedCartItems = sessionStorage.getItem(sessionKey);

    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }
  }
}

