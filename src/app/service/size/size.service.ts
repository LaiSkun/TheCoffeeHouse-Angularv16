import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private sizeURL = 'http://localhost:8089/size';

  constructor(private http:HttpClient) { }

  getAllSize(): Observable<any[]> {
    return this.http.get<any[]>(this.sizeURL);
  }

}
