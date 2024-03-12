import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToppingService {
  private toppingURL = 'http://localhost:8089/topping';

  constructor(private http: HttpClient) {}

  getToppingByProductID(productid: string): Observable<any[]> {
    const url = `${this.toppingURL}/${productid}`;
    url;
    return this.http.get<any[]>(url);
  }

  addProductWithToppings(productName: string, toppings: string[]): Observable<any> {
    const newProduct = { productName, toppings };
    return this.http.post<any>(`${this.toppingURL}/addProductWithToppings`, newProduct);
  }
}
