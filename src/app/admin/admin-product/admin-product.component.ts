import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product/product.service';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, forkJoin, of, tap } from 'rxjs';
import { ToppingService } from 'src/app/service/topping/topping.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css'],
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
export class AdminProductComponent implements OnInit {

  formState: string = 'visible';
  imageName: any;
  base64Image: string = '';
  productList: any[] = [];
  categoryList: any[] = [];
  isProductVisible: boolean = false;
  isCategoryVisible: boolean = false;
  isProductTable = true;
  displayedData: any[] = [];
  productForm: FormGroup = new FormGroup({});
  categoryForm: FormGroup = new FormGroup({});
  createdDate: string = '';
  page: number = 1;

  constructor(
    private productservice: ProductService,
    private formBuilder: FormBuilder
  ) {}

  //Lấy ra ngày hôm nay
  getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    this.createdDate = `${year}-${month < 10 ? '0' : ''}${month}-${
      day < 10 ? '0' : ''
    }${day}`;
    this.productForm.patchValue({createdate: this.createdDate})
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProductList();
    this.getAllCategoryList();
    this.initForm();
    this.getDate();

  }

  //Lấy tất cả product
  getAllProductList() {
    this.productservice.getAllProducts().subscribe((products) => {
      this.productList = products;
      this.displayedData = [...this.productList];
    });
  }
  //Lấy tất cả category
  getAllCategoryList() {
    this.productservice.getAllCategories().subscribe((categories) => {
      this.categoryList = categories;
      this.displayedData = [...this.categoryList];
    });
  }
  //Gôm data của product và category lại
  getAllDataLists() {
    return forkJoin({
      products: this.productservice.getAllProducts(),
      categories: this.productservice.getAllCategories(),
    }).pipe(
      tap((data) => {
        this.productList = data.products;
        this.categoryList = data.categories;
        this.displayedData = this.isProductTable ? this.productList : this.categoryList;
      })
    );
  }
  //Đổi sang data Product
  changeDataProduct() {
    this.isProductTable = true;
    this.page = 1 ;
    this.displayedData = this.isProductTable ? this.productList : this.categoryList;
  }
  //Đổi sang data Category
  changeDataCategory(){
    this.page = 1 ;
    this.isProductTable = false;
    this.displayedData = this.isProductTable ? this.productList : this.categoryList;
  }
  getTableHeaders(): string[] {
    return this.isProductTable ? ['Image','Product ID', 'Product Name','Price','Category','Create Date','Description',] : ['ID', 'Category Name',];
  }
  toggleAddProduct() {
    this.isProductVisible = !this.isProductVisible;
  }

  toggleAddCategory(){
    this.isCategoryVisible = !this.isCategoryVisible;
  }

  ///*****Tương tác Form  */
  //Vadidate trong form
  initForm(): void {
    this.productForm = this.formBuilder.group({
      productid: ['', Validators.required],
      productname: ['', [Validators.required]],
      price: ['', Validators.required , this.minPriceValidator(29000)],
      description: ['', Validators.required],
      img: ['', Validators.required],
      createdate: [this.getDate(), Validators.required],
      category: ['', Validators.required],
    });
    this.productForm.get('productid')?.enable();
    this.categoryForm = this.formBuilder.group({
      categoryid: ['', Validators.required],
      categoryname: ['', Validators.required]
    })
  }


  //validator min price
  minPriceValidator(minPrice: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      if (value !== null && value !== undefined && (isNaN(value) || value < minPrice)) {
        // Giá trị không tồn tại hoặc không phải là số hoặc nhỏ hơn giá trị tối thiểu
        const error = { 'actualPrice': { value }  , 'minPrice' : { minPrice }};
        return of(error);
      }

      return of(null); // Hợp lệ
    };
  }
  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageName = file.name;
      // Sử dụng FileReader để đọc nội dung của tệp thành chuỗi base64
      const reader = new FileReader();
      reader.onload = (e) => {
        this.base64Image = e.target?.result as string;
      };
      console.log(this.productForm.value)
      reader.readAsDataURL(file);
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
  //*****CRUD */
  //Tạo product mới
  createProduct() {
    if (this.productForm.invalid) {
      this.validateAllFormFields(this.productForm);
      return;
    }
    const productid = this.productForm.get('productid')?.value;
    const productname = this.productForm.get('productname')?.value;

    this.productservice.checkProductExists(productid, productname).subscribe(
      ({ productidExists, productnameExists }) => {
        if (productidExists) {
          this.productForm.get('productid')?.setErrors({ exists: true });
        }
        if (productnameExists) {
          this.productForm.get('productname')?.setErrors({ exists: true });
        }
        if (!productidExists && !productnameExists) {
          const formData = this.productForm.value;
          formData.img=this.base64Image;
          console.log(formData);
          this.productservice.addProducts(formData).subscribe(
            (response) => {
              console.log('Sản phẩm đã được thêm:', response);

              alert('Thêm thành công !!!');
              this.getAllDataLists();
              this.getAllProductList();
              this.toggleAddProduct();
              this.resetForm();
            },
            (error) => {
              console.error('Lỗi khi thêm Sản phẩm', error);
            }
          );
        }
      },
      (error) => {
        console.error('Lỗi khi kiểm tra username và email:', error);
      }
    );
  }
  //Chỉnh sửa product
  updateForm() {
    if (this.productForm.invalid) {
      this.validateAllFormFields(this.productForm);
      return;
    }
    else {
      const formData = this.productForm.value;
      formData.img=this.base64Image;
      const productidToUpdate = formData.productid;
      this.productservice.updateProduct(productidToUpdate, formData).subscribe(
        (response) => {
          console.log('Sản phẫm đã được cập nhật:', response);
          alert('Cập nhật thành công !!!');
          this.getAllProductList();
          this.resetForm();
          this.toggleAddProduct();
        },
        (error) => {
          console.error('Lỗi khi cập nhật Sản phẫm', error);
          // Thêm logic xử lý khi có lỗi
        }
      );
    }
  }
  //Đổ data vào form dựa theo
  loadProductData(productid: string): void {
    const product = this.productservice.getProduct(productid).subscribe(
      (product) => {
        this.isProductTable = true
        this.productservice.setData(product); // Lưu thông tin người dùng vào service
        this.loadProductDataFromService();
        this.toggleAddProduct();
      },
      (error) => {
        console.error('Error loading product data', error);
      }
    );
  }
  //Lấy dụa theo
  loadProductDataFromService(): void {
    const product = this.productservice.getData()[0];
    if (product) {
      // Load thông tin người dùng từ service vào form
      this.productForm.patchValue({
        productid: product.productid,
        productname: product.productname,
        price: product.price,
        description: product.description,
        img: '',
        createdate: product.createDate,
        category: product.category.categoryid,
      });
      this.base64Image = product.img
      console.log(this.productForm.value)
      this.productForm.get('productid')?.disable();
    } else {
      console.error('Product data is null or undefined');
    }
  }
  //Xóa PRoduct
  deleteProduct(id: string): void {
    this.productservice.delete(id).subscribe(
      () => {
        alert('Xóa thành công !!!');
        console.log('Users deleted successfully');
        this.getAllProductList();
      },
      (error) => console.error('Error deleting ', error)
    );
  }
  //Tạo category mới
  createCategory() {
    if (this.categoryForm.invalid) {
      this.validateAllFormFields(this.categoryForm);
      return;
    }
    const categoryid = this.categoryForm.get('categoryid')?.value;
    const categoryname = this.categoryForm.get('categoryname')?.value;

    this.productservice.checkCategoryExists(categoryid, categoryname).subscribe(
      ({ categoryidExists, categorynameExists }) => {
        if (categoryidExists) {
          this.categoryForm.get('categoryid')?.setErrors({ exists: true });
        }
        if (categorynameExists) {
          this.categoryForm.get('categoryname')?.setErrors({ exists: true });
        }
        if (!categoryidExists && !categorynameExists) {
          const formData = this.categoryForm.value;
          console.log(formData);
          this.productservice.addCategory(formData).subscribe(
            (response) => {
              console.log('Danh mục đã được thêm:', response);
              alert('Thêm thành công !!!');
              this.getAllDataLists();
              this.getAllCategoryList();
              this.toggleAddCategory();
              this.resetForm();
            },
            (error) => {
              console.error('Lỗi khi thêm danh mục:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Lỗi khi kiểm tra', error);
      }
    );
  }
  //Xóa category
  deleteCategory(id: string): void{
    this.productservice.deleteCategory(id).subscribe(
      () => {
        alert('Xóa thành công !!!');
        console.log('Category deleted successfully');
        this.getAllDataLists();
        this.getAllCategoryList();
      },
      (error) => console.error('Error deleting', error)
    );
  }
  //Chỉnh sửa product
  updateCategoryForm() {
    if (this.categoryForm.invalid) {
      this.validateAllFormFields(this.categoryForm);
      return;
    }
    else {
      const formData = this.categoryForm.value;
      const categoryidToUpdate = formData.categoryid;
      this.productservice.updateCategory(categoryidToUpdate, formData).subscribe(
        (response) => {
          console.log('Danh mục đã được cập nhật:', response);
          alert('Cập nhật thành công !!!');
          this.getAllCategoryList();
          this.resetForm();
          this.toggleAddCategory();
        },
        (error) => {
          console.error('Lỗi khi cập nhật Danh mục', error);
          // Thêm logic xử lý khi có lỗi
        }
      );
    }
  }
  //Đổ data vào form dựa theo
  loadCategoryData(categoryid: string): void {
    const category = this.productservice.getCategory(categoryid).subscribe(
      (category) => {
        this.isProductTable = false
        this.productservice.setData(category); // Lưu thông tin người dùng vào service
        this.loadCategoryDataFromService();
        this.toggleAddCategory();
      },
      (error) => {
        console.error('Error loading product data', error);
      }
    );
  }
  //Lấy dụa theo
  loadCategoryDataFromService(): void {
    const category = this.productservice.getData()[0];
    if (category) {
      // Load thông tin người dùng từ service vào form
      this.categoryForm.patchValue({
        categoryid: category.categoryid,
        categoryname: category.categoryname,
      });
    } else {
      console.error('Product data is null or undefined');
    }
  }
  //**Reset Form
  resetForm(): void {
    this.productForm.get('productid')?.enable();
    this.productForm.reset();
    this.categoryForm.reset();
    this.base64Image = '';
    this.imageName='';
    this.initForm();
    this.productForm.patchValue({createdate : this.getDate()});
  }
}
