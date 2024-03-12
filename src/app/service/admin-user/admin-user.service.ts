import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private userData: any;

  private apiUserURL = 'http://localhost:8089/user';

  constructor(private http:HttpClient) { }

  getUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUserURL}/${username}`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUserURL}/getAllUser`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUserURL}/addUser`, user);
  }

  delete(id: string):Observable<void> {
    return this.http.delete<any>(`${this.apiUserURL}/delete/${id}`)
  }

  updateUser(username: string, updatedUser: any): Observable<any> {
    const url = `${this.apiUserURL}/${username}`;
    return this.http.put(`${this.apiUserURL}/edit/${username}`,updatedUser)
  }

  getUserData(): any {
    return this.userData;
  }

  setUserData(user: any): void {
    this.userData = user;
  }

  checkUserExists(username: string, email: string): Observable<{ usernameExists: boolean, emailExists: boolean }> {
    const url = `${this.apiUserURL}/exists/user`;
    const params = new HttpParams()
      .set('username', username)
      .set('email', email);

    return this.http.get<{ usernameExists: boolean, emailExists: boolean }>(url, { params });
  }
}
