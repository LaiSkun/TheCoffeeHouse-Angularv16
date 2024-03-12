import { Component, OnInit } from '@angular/core';
import { AdminUserService } from '../../service/admin-user/admin-user.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'visible',
        style({
          height: '*',
          width: '*',
          opacity: 1,

        })
      ),
      state(
        'hidden',
        style({
          height: '0',
          width: '0',
          opacity: 0,
        })
      ),
      transition('visible <=> hidden', animate('0.5s ease-in-out')),
    ]),
  ],
})
export class AdminUserComponent implements OnInit {
  isDivVisible: boolean = false;

  page: number = 1;

  userList: any[] = [];

  userForm: FormGroup = new FormGroup({});

  isUsersLoaded:boolean = true;

  constructor(
    private adminuserService: AdminUserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.initForm();
  }
  getAllUsers() {
    this.adminuserService.getAllUsers().subscribe((data) => {
      this.userList = data;
      this.isUsersLoaded = true;

    });
  }

  //Mở form
  toggleAdd() {
    this.isDivVisible = !this.isDivVisible;
  }

  //****Tương tác trong Form

  //So sánh password và confirm password
  passwordMatchValidator(formGroup: FormGroup): null | { mismatch: boolean } {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }

  // Hàm để kiểm tra và hiển thị lỗi cho tất cả các trường trong form
  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  //Vadidate trong form
  initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        role: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.userForm.get('username')?.enable();
  }

  //********CRUD

  //**Thêm
  submitForm(): void {
    if (this.userForm.invalid) {
      this.validateAllFormFields(this.userForm);
      return;
    }

    const username = this.userForm.get('username')?.value;
    const email = this.userForm.get('email')?.value;

    this.adminuserService.checkUserExists(username, email).subscribe(
      ({ usernameExists, emailExists }) => {
        if (usernameExists) {
          this.userForm.get('username')?.setErrors({exists: true})
        }
        if (emailExists) {
          this.userForm.get('email')?.setErrors({exists: true})
        }
        if (!usernameExists && !emailExists) {
          const formData = this.userForm.value;
          console.log(formData);
          this.adminuserService.addUser(formData).subscribe(
            (response) => {
              console.log('Người dùng đã được thêm:', response);
              // Thêm logic xử lý sau khi thêm người dùng thành công
              alert('Thêm thành công !!!');
              this.getAllUsers();
              this.resetForm();
              this.toggleAdd();
            },
            (error) => {
              console.error('Lỗi khi thêm người dùng:', error);
              // Thêm logic xử lý khi có lỗi
            }
          );
          this.resetForm();
        }
      },
      (error) => {
        console.error('Lỗi khi kiểm tra username và email:', error);
      }
    );
  }

  //**Sửa
  updateUserForm(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const usernameToUpdate = formData.username; // Định danh người dùng cần cập nhật
      this.adminuserService.updateUser(usernameToUpdate, formData).subscribe(
        (response) => {
          console.log('Người dùng đã được cập nhật:', response);
          // Thêm logic xử lý sau khi cập nhật người dùng thành công
          alert('Cập nhật thành công !!!');
          this.getAllUsers();
          this.resetForm();
          this.toggleAdd();
        },
        (error) => {
          console.error('Lỗi khi cập nhật người dùng:', error);
          // Thêm logic xử lý khi có lỗi
        }
      );
    }
  }

  //**Xóa
  deleteUser(id: string): void {
    this.adminuserService.delete(id).subscribe(
      () => {
        alert('Xóa thành công !!!');
        console.log('Users deleted successfully');

        this.isUsersLoaded = false;
        this.getAllUsers();
      },
      (error) => console.error('Error deleting ssers', error)
    );
  }

  //Đổ data vào form dựa theo username
  loadUserData(username: string): void {
    const user = this.adminuserService.getUser(username).subscribe(
      (user) => {
        this.adminuserService.setUserData(user); // Lưu thông tin người dùng vào service
        this.loadUserDataFromService();
        this.toggleAdd();
      },
      (error) => {
        console.error('Error loading user data', error);
      }
    );
  }
  //Lấy User dụa theo
  loadUserDataFromService(): void {
    const user = this.adminuserService.getUserData()[0];
    if (user) {
      // Load thông tin người dùng từ service vào form
      this.userForm.patchValue({
        username: user.username,
        password: user.password,
        address: user.address,
        phone: user.phone,
        email: user.email,
        role: user.role.roleid,
      });
      this.userForm.get('username')?.disable();
    } else {
      console.error('User data is null or undefined');
    }
  }
  //**Reset Form
  resetForm(): void {
    this.userForm.get('username')?.enable();
    this.userForm.reset();
    this.initForm();
  }
}
