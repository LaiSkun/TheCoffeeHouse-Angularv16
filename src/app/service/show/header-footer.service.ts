import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderFooterService {

  private showHeaderFooter = true

  constructor() { }

  setShowHeaderFooter(show: boolean):void{
    this.showHeaderFooter = show;
  }

  getShowHeaderFooter():boolean{
    return this.showHeaderFooter;
  }
}
