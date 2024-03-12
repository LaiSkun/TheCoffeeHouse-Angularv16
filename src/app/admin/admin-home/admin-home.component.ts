import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { HeaderFooterService } from 'src/app/service/show/header-footer.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(private headerService: HeaderFooterService ,private authService: AuthService){}
  ngOnInit(): void {
    this.headerService.setShowHeaderFooter(false);
  }

  ngOnDestroy(): void {
    this.headerService.setShowHeaderFooter(true);
  }
  logout():void {
    this.authService.logout();
  }
  getUsernameFromSessionStorage(): string {
    return sessionStorage.getItem('username') || '';
  }
}
