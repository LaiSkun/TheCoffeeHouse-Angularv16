import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private cookieService: CookieService) {

   }

  cartItems: any[] = [];

  addtoCart(product: any,quantity: number = 1 , size: any ,topping: any){
    if (size.length === 0) {
      alert("Vui lòng chọn Size")
    return;
  }
  // Tìm xem có sản phẩm nào trong giỏ hàng có cùng size nhưng khác topping không
  const existingItem = this.cartItems.find(item => item.product.productid === product.productid && item.size === size && item.topping === topping );
  //Nếu cùng size cùng topping thì cập nhật số lượng
  if(existingItem){
    existingItem.quantity += quantity;
  }else{
    const newItem = {
      product,
      quantity,
      size,
      topping,
    };
    this.cartItems.push(newItem);
    console.log(this.cartItems)
   }
  this.updateSessionStorage();

}

 // Hàm kiểm tra xem hai mảng topping có khác nhau hay không


  getCartItems(){
    return this.cartItems;
  }

  removeFromCartItems(product: any ,quantity: number = 1 ,size: any ,topping: any){
    const index = this.cartItems.findIndex( (item) => item.product.productid === product.productid  && item.size === size && item.topping === topping  );
    if(index !== -1 ){
      this.cartItems.splice(index,1);
      this.updateSessionStorage();
    }
  }

  clearAllCartItems(){
    this.cartItems = [];
    this.updateSessionStorage();
    return this.cartItems;
  }

  private updateSessionStorage() {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  // private updateCookies() {
  //   const expirationTimeInSeconds = 3600;
  //   const expires = new Date();
  //   expires.setSeconds(expires.getSeconds() + expirationTimeInSeconds);

  //   // Sử dụng ngx-cookie-service để tạo cookies
  //   this.cookieService.set('cartItems', JSON.stringify(this.cartItems), expires);
  // }
}
