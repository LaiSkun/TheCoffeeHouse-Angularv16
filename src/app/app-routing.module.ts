import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ContactComponent } from './components/contact/contact.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailModalComponent } from './components/order-detail-modal/order-detail-modal.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
{path:'',component: HomeComponent},
{path:'product/collection/all',component: ProductListComponent},
{path:'product/:id',component:ProductDetailComponent},
{path:'product/collection/:categoryid',component:ProductListComponent},
{path:'contact',component: ContactComponent},
{path:'contact/:categoryId', component: ContactComponent},
{path:'order',component: OrderComponent},
{path:'order/:orderId', component: OrderDetailModalComponent },
{path:'login', component: LoginComponent },
{path:'register', component: RegisterComponent },
{path:'404', component: NotFoundComponent },
{path:'forgot-password', component: ForgotPasswordComponent },
{path: 'admin',
  // canActivate:[AuthGuard],
  loadChildren: () => import('./admin/admin.module').then((m)=>m.AdminModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
