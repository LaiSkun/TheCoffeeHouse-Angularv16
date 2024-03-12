import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDTO } from 'src/app/common/OrderDTO';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderapiURL = 'http://localhost:8089/orders';


  constructor(private http:HttpClient) { }

  checkout(order: OrderDTO): Observable<string> {
    return this.http.post<string>(`${this.orderapiURL}/checkout`, order);
  }

  getAllOrder(): Observable<any[]> {
    return this.http.get<any[]>(this.orderapiURL);
  }

  filterOrderdetailByOrder(orderId: number): Observable<any[]> {
    const filterURL = `${this.orderapiURL}/${orderId}`;
    return this.http.get<any[]>(filterURL);
  }

  getMonthlyRevenueByYear(year: number): Observable<any> {
    const url = `${this.orderapiURL}/monthly-revenue-by-year?year=${year}`;
    return this.http.get(url);
  }

}
