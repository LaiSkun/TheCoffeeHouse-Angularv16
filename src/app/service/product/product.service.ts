import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Product } from '../../common/product';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private Data: any;

  private productapiURL = 'http://localhost:8089/product';

  private categoryapiURL = 'http://localhost:8089/category';

  constructor(private http:HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.productapiURL}/productList`);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryapiURL);
  }

  filterProductsByCategory(categoryId: string): Observable<any[]> {
    const filterURL = `${this.productapiURL}/${categoryId}`;
    return this.http.get<any[]>(filterURL);
  }
  getProduct(productid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.productapiURL}/findbyProductID/${productid}`);
  }
  addProducts(product: any): Observable<any> {
    return this.http.post<any>(`${this.productapiURL}/addProduct`, product);
  }
  delete(id: string):Observable<void> {
    return this.http.delete<any>(`${this.productapiURL}/delete/${id}`)
  }
  updateProduct(productid: string, updatedProduct: any): Observable<any> {
    return this.http.put(`${this.productapiURL}/edit/${productid}`,updatedProduct)
  }
  checkProductExists(productid: string, productname: string): Observable<{ productidExists: boolean, productnameExists: boolean }> {
    const url = `${this.productapiURL}/exists/product`;
    const params = new HttpParams()
      .set('productid', productid)
      .set('productname', productname);
      return this.http.get<{ productidExists: boolean, productnameExists: boolean }>(url, { params });
  }
  getData(): any {
    return this.Data;
  }
  setData(data: any): void {
    this.Data = data;
  }
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.categoryapiURL}/addCategory`, category);
  }
  deleteCategory(id: string):Observable<void> {
    return this.http.delete<any>(`${this.categoryapiURL}/delete/${id}`)
  }
  updateCategory(categoryid: string, updatedCategory: any): Observable<any> {
    return this.http.put(`${this.categoryapiURL}/edit/${categoryid}`,updatedCategory)
  }
  getCategory(categoryid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.categoryapiURL}/findbyCategoryID/${categoryid}`);
  }
  checkCategoryExists(categoryid: string, categoryname: string): Observable<{ categoryidExists: boolean, categorynameExists: boolean }> {
    const url = `${this.categoryapiURL}/exists/category`;
    const params = new HttpParams()
      .set('categoryid', categoryid)
      .set('categoryname', categoryname);
      return this.http.get<{ categoryidExists: boolean, categorynameExists: boolean }>(url, { params });
  }
}
