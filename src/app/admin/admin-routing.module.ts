import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'order', component: AdminOrderComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'user', component: AdminUserComponent },
      { path: '', redirectTo:'/admin/dashboard',pathMatch:'full' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
