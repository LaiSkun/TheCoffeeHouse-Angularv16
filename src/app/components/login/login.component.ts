import { Component, OnInit } from '@angular/core';
import { HeaderFooterService } from '../../service/show/header-footer.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {
  constructor(private authService: AuthService,private headerService:HeaderFooterService,private router: Router){}

  ngOnInit(): void {
    this.headerService.setShowHeaderFooter(false);
  }

  ngOnDestroy(): void {
    this.headerService.setShowHeaderFooter(true);
  }

  credentials = { username: '', password: '' };
  login(): void {
    console.log(this.credentials)
    this.authService.login(this.credentials).subscribe(
      (response) => {
        localStorage.setItem('access_token', response.token);
        sessionStorage.setItem('username', this.credentials.username);
        // Thực hiện chuyển hướng hoặc các tác vụ sau khi đăng nhập thành công
        const userRoles = response.role;
        console.log(userRoles)
        if(userRoles.includes('Admin') || userRoles.includes('Staff')){
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['']);
        }
        alert('Đăng nhập thành công !!!')
      },
      (error) => {
        alert('Đăng nhập thất bại !!!')
        console.error('Login failed', error);
        // Xử lý lỗi đăng nhập
      }
    );
  }
}
