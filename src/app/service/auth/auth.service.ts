import { JwtHelperService } from '@auth0/angular-jwt';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8089/user/login';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, credentials);
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    this.router.navigate(['login']);
  }
}
