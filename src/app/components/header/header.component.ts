import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { CartService } from 'src/app/service/cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartItems: any[] = [];

  constructor(private cartService: CartService, private authService: AuthService) {

  }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }

  removeCart(item : any) {
    this.cartService.removeFromCartItems(item.product,item.quantity,item.size,item.topping);
    this.cartItems = this.cartService.getCartItems();
  }

  handleQuantityChange(item: any): void {
    if(item.quantity === 0 ){
      this.removeCart(item);
    }
    (item)
    this.updateCookies();
  }
  private updateCookies() {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.cartItems.forEach(item => {
      totalPrice += (item.product.price + item.size.price) * item.quantity + this.getToppingPrice(item.topping) ;
    })
    return totalPrice;
  }

  calculateTotalQuantity(): number {
    let totalQuantity = 0;
    this.cartItems.forEach( item => {
      totalQuantity += item.quantity;
    })
    return totalQuantity;
  }

  getToppingNames(toppings: any[]): string {
    return toppings.map(topping => topping.toppingname).join(', ');
  }

  getToppingPrice(toppings: any[]): number {
    return toppings.reduce((totalPrice,topping) => totalPrice + topping.toppingprice,0);
  }

  logout():void {
    this.authService.logout();
  }

  isLogin():boolean{
     return this.authService.isLoggedIn();
  }

  getUsernameFromSessionStorage(): string {
    return sessionStorage.getItem('username') || '';
  }

}
